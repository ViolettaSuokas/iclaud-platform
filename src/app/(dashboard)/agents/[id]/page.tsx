import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Activity, Server, Cpu, HardDrive, Globe, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AgentControls } from './agent-controls';
import { AgentLogs } from './agent-logs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      cloud: {
        select: { name: true, region: true, userId: true },
      },
      logs: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      chainAgents: {
        include: {
          chain: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!agent || agent.cloud.userId !== session.user.id) {
    notFound();
  }

  const statusConfig: Record<string, { color: string; label: string }> = {
    running: { color: '#00ff88', label: 'Running' },
    stopped: { color: '#6b6b80', label: 'Stopped' },
    error: { color: '#ff3b5c', label: 'Error' },
    deploying: { color: '#bf5af2', label: 'Deploying' },
    building: { color: '#ffcc00', label: 'Building' },
  };

  const status = statusConfig[agent.status] || statusConfig.stopped;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/agents"
          className="p-2 rounded-md hover:bg-white/[0.05] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <span
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${status.color}15`,
                color: status.color,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {agent.cloud.name} • {agent.cloud.region}
          </p>
        </div>
        <AgentControls agentId={agent.id} currentStatus={agent.status} />
      </div>

      {/* Info Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="crypto-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Total Calls</span>
          </div>
          <p className="text-2xl font-bold font-mono">{agent.totalCalls.toLocaleString()}</p>
        </div>

        <div className="crypto-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Avg Response</span>
          </div>
          <p className="text-2xl font-bold font-mono">{agent.avgResponse.toFixed(2)}s</p>
        </div>

        <div className="crypto-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Cpu className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">CPU</span>
          </div>
          <p className="text-2xl font-bold font-mono">{agent.cpu} vCPU</p>
        </div>

        <div className="crypto-card rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <HardDrive className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Memory</span>
          </div>
          <p className="text-2xl font-bold font-mono">{agent.memory}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Agent Info */}
          <div className="crypto-card rounded-lg p-5">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Configuration</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-muted-foreground">Runtime</dt>
                <dd className="text-sm font-mono mt-0.5">{agent.runtime}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Port</dt>
                <dd className="text-sm font-mono mt-0.5">{agent.port}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Entrypoint</dt>
                <dd className="text-sm font-mono mt-0.5">{agent.entrypoint || 'main.py'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Source</dt>
                <dd className="text-sm font-mono mt-0.5 capitalize">{agent.sourceType}</dd>
              </div>
              {agent.gitUrl && (
                <div>
                  <dt className="text-xs text-muted-foreground">Git URL</dt>
                  <dd className="text-sm font-mono mt-0.5 break-all">{agent.gitUrl}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-sm mt-0.5">
                  {formatDistanceToNow(agent.createdAt, { addSuffix: true })}
                </dd>
              </div>
              {agent.lastCallAt && (
                <div>
                  <dt className="text-xs text-muted-foreground">Last Call</dt>
                  <dd className="text-sm mt-0.5">
                    {formatDistanceToNow(agent.lastCallAt, { addSuffix: true })}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Endpoint */}
          {agent.endpoint && (
            <div className="crypto-card rounded-lg p-5">
              <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Endpoint
              </h3>
              <code className="block p-3 rounded bg-black/50 text-xs font-mono text-[#00ff88] break-all">
                {agent.endpoint}
              </code>
            </div>
          )}

          {/* Chains */}
          {agent.chainAgents.length > 0 && (
            <div className="crypto-card rounded-lg p-5">
              <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Used in Chains</h3>
              <div className="space-y-2">
                {agent.chainAgents.map((ca) => (
                  <Link
                    key={ca.chain.id}
                    href={`/chains/${ca.chain.id}`}
                    className="block p-2 rounded bg-white/[0.02] hover:bg-white/[0.05] text-sm transition-colors"
                  >
                    {ca.chain.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Logs */}
        <div className="lg:col-span-2">
          <div className="crypto-card rounded-lg p-5">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Logs
            </h3>
            <AgentLogs logs={agent.logs} agentId={agent.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
