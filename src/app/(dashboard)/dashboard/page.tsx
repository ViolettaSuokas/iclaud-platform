import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AgentsList } from '@/components/dashboard/agents-list';
import { ChainsList } from '@/components/dashboard/chains-list';
import { SecurityStatus } from '@/components/dashboard/security-status';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Fetch all data for iClaud dashboard with error handling
  let user = null;
  let cloudsCount = 0;
  let agentsData: Awaited<ReturnType<typeof prisma.agent.findMany>> = [];
  let chainsData: Awaited<ReturnType<typeof prisma.chain.findMany>> = [];
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

  const stats = {
    clouds: cloudsCount || 0,
    agents: safeAgentsData.length,
    runningAgents,
    chains: safeChainsData.length,
    activeChains,
    credits: user?.credits || 0,
  };

  // Create recent activity from various sources
  const activities = [
    ...safeAgentsData
      .filter((a) => a.status === 'running')
      .slice(0, 2)
      .map((agent) => ({
        id: `agent-${agent.id}`,
        type: 'agent_deployed' as const,
        message: `${agent.name} deployed to ${agent.cloud.region}`,
        timestamp: agent.updatedAt,
        metadata: { agentName: agent.name },
      })),
    ...safeAgentsData
      .filter((a) => a.status === 'deploying')
      .map((agent) => ({
        id: `building-${agent.id}`,
        type: 'agent_building' as const,
        message: `${agent.name} deployment in progress`,
        timestamp: agent.updatedAt,
        metadata: { agentName: agent.name },
      })),
    ...safeChainsData
      .filter((c) => c.lastRunAt)
      .slice(0, 2)
      .map((chain) => ({
        id: `chain-${chain.id}`,
        type: 'chain_executed' as const,
        message: `${chain.name} executed successfully`,
        timestamp: chain.lastRunAt!,
        metadata: { chainName: chain.name },
      })),
    ...safeSecurityEvents
      .filter((e) => e.blocked)
      .slice(0, 2)
      .map((event) => ({
        id: `security-${event.id}`,
        type: 'security_event' as const,
        message: event.description,
        timestamp: event.createdAt,
        metadata: { severity: event.severity },
      })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
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

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Agents List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AgentsList agents={safeAgentsData} />
        </div>

        {/* Security Status */}
        <div>
          <SecurityStatus events={safeSecurityEvents} totalBlocked={blockedThreats} />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chains */}
        <ChainsList chains={safeChainsData} />

        {/* Activity */}
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
