'use client';

import Link from 'next/link';
import { Bot, ExternalLink, ArrowUpRight, Activity, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  name: string;
  description: string | null;
  status: string;
  runtime: string;
  endpoint: string | null;
  totalCalls: number;
  avgResponse: number;
  cloud: {
    name: string;
    region: string;
  };
}

interface AgentsListProps {
  agents: Agent[];
}

const statusConfig: Record<string, { color: string; label: string; glow: boolean }> = {
  running: { color: '#00ff88', label: 'Running', glow: true },
  stopped: { color: '#6b6b80', label: 'Stopped', glow: false },
  error: { color: '#ff3b5c', label: 'Error', glow: true },
  deploying: { color: '#bf5af2', label: 'Deploying', glow: true },
  building: { color: '#ffcc00', label: 'Building', glow: true },
};

const runtimeConfig: Record<string, { color: string }> = {
  python: { color: '#3776ab' },
  nodejs: { color: '#68a063' },
  docker: { color: '#2496ed' },
};

export function AgentsList({ agents }: AgentsListProps) {
  if (agents.length === 0) {
    return (
      <div className="crypto-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            My Agents
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-lg bg-white/[0.03] flex items-center justify-center mb-4">
            <Bot className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">No agents deployed yet</p>
          <Button
            asChild
            className="bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#05050a] font-semibold text-xs uppercase tracking-wider"
          >
            <Link href="/agents/new">Deploy Agent</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          My Agents
        </h3>
        <Link
          href="/agents"
          className="text-xs text-muted-foreground hover:text-[#00ff88] transition-colors flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {agents.slice(0, 5).map((agent) => {
          const status = statusConfig[agent.status] || statusConfig.stopped;
          const runtime = runtimeConfig[agent.runtime] || { color: '#6b6b80' };

          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="flex items-center justify-between p-3 rounded-md bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${status.color}15` }}
                >
                  <Bot className="h-5 w-5" style={{ color: status.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground group-hover:text-[#00ff88] transition-colors">
                      {agent.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 border-white/[0.08] font-mono capitalize"
                      style={{
                        backgroundColor: `${runtime.color}15`,
                        color: runtime.color,
                        borderColor: `${runtime.color}30`
                      }}
                    >
                      {agent.runtime}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {agent.cloud.name} • {agent.cloud.region}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Metrics */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span className="font-mono">{agent.totalCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{agent.avgResponse.toFixed(2)}s</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: status.color,
                      boxShadow: status.glow ? `0 0 8px ${status.color}80` : 'none',
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{status.label}</span>
                </div>

                {/* External link */}
                {agent.endpoint && agent.status === 'running' && (
                  <a
                    href={agent.endpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-white/[0.05] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
