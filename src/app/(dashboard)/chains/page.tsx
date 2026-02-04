import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Link2, Plus, ArrowRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: '#00ff88', label: 'Active' },
  inactive: { color: '#6b6b80', label: 'Inactive' },
  running: { color: '#bf5af2', label: 'Running' },
};

export default async function ChainsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const chains = await prisma.chain.findMany({
    where: { userId: session.user.id },
    include: {
      agents: {
        include: { agent: { select: { id: true, name: true, status: true } } },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agent Chains</h2>
          <p className="text-muted-foreground">
            Connect agents together for complex workflows
          </p>
        </div>
        <Button
          asChild
          className="bg-[#bf5af2] hover:bg-[#bf5af2]/90 text-white font-semibold text-xs uppercase tracking-wider"
        >
          <Link href="/chains/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Chain
          </Link>
        </Button>
      </div>

      {chains.length === 0 ? (
        <div className="crypto-card rounded-lg p-12 text-center">
          <div className="h-16 w-16 rounded-lg bg-[#bf5af2]/15 flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-8 w-8 text-[#bf5af2]" />
          </div>
          <h3 className="text-lg font-medium mb-2">No chains created</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first chain to connect agents together
          </p>
          <Button
            asChild
            className="bg-[#bf5af2] hover:bg-[#bf5af2]/90 text-white font-semibold"
          >
            <Link href="/chains/new">Create Chain</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {chains.map((chain) => {
            const status = statusConfig[chain.status] || statusConfig.inactive;

            return (
              <Link
                key={chain.id}
                href={`/chains/${chain.id}`}
                className="crypto-card rounded-lg p-6 group hover:border-[#bf5af2]/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#bf5af2]/15 flex items-center justify-center">
                      <Link2 className="h-5 w-5 text-[#bf5af2]" />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-[#bf5af2] transition-colors">
                        {chain.name}
                      </h3>
                      {chain.description && (
                        <p className="text-xs text-muted-foreground">{chain.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: status.color,
                        boxShadow: status.color !== '#6b6b80' ? `0 0 6px ${status.color}80` : 'none',
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{status.label}</span>
                  </div>
                </div>

                {/* Chain visualization */}
                <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
                  {chain.agents.map((item, index) => (
                    <div key={item.id} className="flex items-center">
                      <div
                        className="px-3 py-1.5 rounded-md border text-xs font-mono whitespace-nowrap"
                        style={{
                          backgroundColor: item.agent.status === 'running' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.02)',
                          borderColor: item.agent.status === 'running' ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)',
                          color: item.agent.status === 'running' ? '#00ff88' : '#6b6b80',
                        }}
                      >
                        {item.agent.name}
                      </div>
                      {index < chain.agents.length - 1 && (
                        <ArrowRight className="h-4 w-4 mx-2 text-[#bf5af2]" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="font-mono">{chain.executions.toLocaleString()} runs</span>
                    <span className="font-mono">~{chain.avgDuration.toFixed(1)}s avg</span>
                  </div>
                  {chain.lastRunAt && (
                    <span>Last: {formatDistanceToNow(new Date(chain.lastRunAt), { addSuffix: true })}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
