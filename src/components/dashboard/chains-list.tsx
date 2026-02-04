'use client';

import Link from 'next/link';
import { Link2, ArrowUpRight, Play, Pause, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Chain {
  id: string;
  name: string;
  description: string | null;
  status: string;
  executions: number;
  avgDuration: number;
  lastRunAt: Date | null;
  agents: {
    agent: {
      id: string;
      name: string;
    };
    order: number;
  }[];
}

interface ChainsListProps {
  chains: Chain[];
}

const statusConfig: Record<string, { color: string; label: string; icon: typeof Play }> = {
  active: { color: '#00ff88', label: 'Active', icon: Play },
  inactive: { color: '#6b6b80', label: 'Inactive', icon: Pause },
  running: { color: '#bf5af2', label: 'Running', icon: Play },
};

export function ChainsList({ chains }: ChainsListProps) {
  if (chains.length === 0) {
    return (
      <div className="crypto-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Agent Chains
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-lg bg-white/[0.03] flex items-center justify-center mb-4">
            <Link2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">No chains created yet</p>
          <Button
            asChild
            className="bg-[#bf5af2] hover:bg-[#bf5af2]/90 text-white font-semibold text-xs uppercase tracking-wider"
          >
            <Link href="/chains/new">Create Chain</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          Agent Chains
        </h3>
        <Link
          href="/chains"
          className="text-xs text-muted-foreground hover:text-[#bf5af2] transition-colors flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {chains.slice(0, 3).map((chain) => {
          const status = statusConfig[chain.status] || statusConfig.inactive;
          const sortedAgents = [...chain.agents].sort((a, b) => a.order - b.order);

          return (
            <Link
              key={chain.id}
              href={`/chains/${chain.id}`}
              className="block p-4 rounded-md bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-[#bf5af2]/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground group-hover:text-[#bf5af2] transition-colors">
                      {chain.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: status.color,
                          boxShadow: status.color !== '#6b6b80' ? `0 0 6px ${status.color}80` : 'none',
                        }}
                      />
                      <span className="text-[10px] text-muted-foreground uppercase">{status.label}</span>
                    </div>
                  </div>
                  {chain.description && (
                    <p className="text-xs text-muted-foreground mt-1">{chain.description}</p>
                  )}
                </div>
              </div>

              {/* Chain visualization */}
              <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
                {sortedAgents.map((item, index) => (
                  <div key={item.agent.id} className="flex items-center">
                    <div className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                      {item.agent.name}
                    </div>
                    {index < sortedAgents.length - 1 && (
                      <ArrowRight className="h-3 w-3 mx-1 text-[#bf5af2]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-mono">{chain.executions.toLocaleString()} runs</span>
                <span className="font-mono">~{chain.avgDuration.toFixed(1)}s avg</span>
                {chain.lastRunAt && (
                  <span>Last: {formatDistanceToNow(new Date(chain.lastRunAt), { addSuffix: true })}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
