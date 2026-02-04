import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Bot, Plus, Activity, Clock, ExternalLink, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<string, { color: string; label: string }> = {
  running: { color: '#00ff88', label: 'Running' },
  stopped: { color: '#6b6b80', label: 'Stopped' },
  error: { color: '#ff3b5c', label: 'Error' },
  deploying: { color: '#bf5af2', label: 'Deploying' },
};

const runtimeConfig: Record<string, { color: string }> = {
  python: { color: '#3776ab' },
  nodejs: { color: '#68a063' },
  docker: { color: '#2496ed' },
};

export default async function AgentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const agents = await prisma.agent.findMany({
    where: { cloud: { userId: session.user.id } },
    include: { cloud: { select: { name: true, region: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agents</h2>
          <p className="text-muted-foreground">
            Deploy and manage your AI agents
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

      {agents.length === 0 ? (
        <div className="crypto-card rounded-lg p-12 text-center">
          <div className="h-16 w-16 rounded-lg bg-[#00ff88]/15 flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-[#00ff88]" />
          </div>
          <h3 className="text-lg font-medium mb-2">No agents deployed</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Deploy your first AI agent to get started
          </p>
          <Button
            asChild
            className="bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#05050a] font-semibold"
          >
            <Link href="/agents/new">Deploy Agent</Link>
          </Button>
        </div>
      ) : (
        <div className="crypto-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cloud</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Calls</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Response</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => {
                  const status = statusConfig[agent.status] || statusConfig.stopped;
                  const runtime = runtimeConfig[agent.runtime] || { color: '#6b6b80' };

                  return (
                    <tr key={agent.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="p-4">
                        <Link href={`/agents/${agent.id}`} className="flex items-center gap-3 group">
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${status.color}15` }}
                          >
                            <Bot className="h-5 w-5" style={{ color: status.color }} />
                          </div>
                          <div>
                            <span className="font-medium group-hover:text-[#00ff88] transition-colors">
                              {agent.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 border-white/[0.08] font-mono capitalize"
                                style={{
                                  backgroundColor: `${runtime.color}15`,
                                  color: runtime.color,
                                  borderColor: `${runtime.color}30`
                                }}
                              >
                                {agent.runtime}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: status.color,
                              boxShadow: status.color !== '#6b6b80' ? `0 0 6px ${status.color}80` : 'none',
                            }}
                          />
                          <span className="text-sm">{status.label}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{agent.cloud.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono">{agent.totalCalls.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono">{agent.avgResponse.toFixed(2)}s</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {agent.endpoint && agent.status === 'running' && (
                            <a
                              href={agent.endpoint}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded hover:bg-white/[0.05] text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button className="p-2 rounded hover:bg-white/[0.05] text-muted-foreground hover:text-foreground transition-colors">
                            {agent.status === 'running' ? (
                              <Square className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
