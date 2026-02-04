import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AgentsList } from '@/components/dashboard/agents-list';
import { ChainsList } from '@/components/dashboard/chains-list';
import { SecurityStatus } from '@/components/dashboard/security-status';
import { LiveActivity } from '@/components/dashboard/live-activity';
import { ConnectedChannels } from '@/components/dashboard/connected-channels';
import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Fetch all data
  let user = null;
  let cloudsCount = 0;
  let agentsData: Array<{
    id: string;
    name: string;
    description: string | null;
    status: string;
    runtime: string;
    endpoint: string | null;
    totalCalls: number;
    avgResponse: number;
    cloud: { name: string; region: string };
  }> = [];
  let chainsData: Array<{
    id: string;
    name: string;
    description: string | null;
    status: string;
    executions: number;
    avgDuration: number;
    lastRunAt: Date | null;
    agents: Array<{
      order: number;
      agent: { id: string; name: string };
    }>;
  }> = [];
  let securityEvents: Awaited<ReturnType<typeof prisma.securityEvent.findMany>> = [];

  try {
    [user, cloudsCount, agentsData, chainsData, securityEvents] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true, name: true },
      }),
      prisma.cloud.count({ where: { userId } }),
      prisma.agent.findMany({
        where: { cloud: { userId } },
        include: { cloud: { select: { name: true, region: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.chain.findMany({
        where: { userId },
        include: {
          agents: {
            include: { agent: { select: { id: true, name: true } } },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.securityEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  const safeAgentsData = agentsData || [];
  const safeChainsData = chainsData || [];
  const safeSecurityEvents = securityEvents || [];

  const runningAgents = safeAgentsData.filter((a) => a.status === 'running').length;
  const activeChains = safeChainsData.filter((c) => c.status === 'active').length;
  const blockedThreats = safeSecurityEvents.filter((e) => e.blocked).length;

  // Calculate extended metrics
  const totalApiCalls = safeAgentsData.reduce((acc, a) => acc + a.totalCalls, 0);
  const avgResponseTime = safeAgentsData.length > 0
    ? safeAgentsData.reduce((acc, a) => acc + a.avgResponse, 0) / safeAgentsData.length
    : 0;
  const chainExecutions = safeChainsData.reduce((acc, c) => acc + c.executions, 0);
  const avgChainDuration = safeChainsData.length > 0
    ? safeChainsData.reduce((acc, c) => acc + c.avgDuration, 0) / safeChainsData.length
    : 0;

  const stats = {
    clouds: cloudsCount || 0,
    agents: safeAgentsData.length,
    runningAgents,
    chains: safeChainsData.length,
    activeChains,
    credits: user?.credits || 0,
    totalApiCalls,
    avgResponseTime,
    chainExecutions,
    avgChainDuration,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            <Sparkles className="h-5 w-5 text-[#ffcc00]" />
          </h2>
          <p className="text-muted-foreground">
            Your AI agent infrastructure at a glance
          </p>
        </div>
        <Button
          asChild
          className="bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#05050a] font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          <Link href="/agents/new">
            <Plus className="h-4 w-4 mr-2" />
            Deploy Agent
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Agents (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AgentsList agents={safeAgentsData} />
          <ChainsList chains={safeChainsData} />
        </div>

        {/* Right Column - Activity & Channels (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <LiveActivity />
          <ConnectedChannels />
          <SecurityStatus events={safeSecurityEvents} totalBlocked={blockedThreats} />
        </div>
      </div>
    </div>
  );
}
