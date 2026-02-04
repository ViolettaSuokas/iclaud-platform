'use client';

import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Clock, Shield, Bot, Link2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'agent_deployed' | 'agent_stopped' | 'agent_error' | 'chain_executed' | 'security_event' | 'agent_building';
  message: string;
  timestamp: Date;
  metadata?: {
    agentName?: string;
    chainName?: string;
    severity?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  agent_deployed: { icon: CheckCircle, color: '#00ff88' },
  agent_stopped: { icon: Clock, color: '#6b6b80' },
  agent_error: { icon: XCircle, color: '#ff3b5c' },
  agent_building: { icon: Clock, color: '#ffcc00' },
  chain_executed: { icon: Link2, color: '#bf5af2' },
  security_event: { icon: Shield, color: '#00d4ff' },
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="crypto-card rounded-lg p-6">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
          Recent Activity
        </h3>
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          Recent Activity
        </h3>
        <Link
          href="/activity"
          className="text-xs text-muted-foreground hover:text-[#00ff88] transition-colors flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const config = activityConfig[activity.type] || activityConfig.agent_building;
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-md bg-white/[0.02] border border-white/[0.04]"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md shrink-0"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <Icon className="h-4 w-4" style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
