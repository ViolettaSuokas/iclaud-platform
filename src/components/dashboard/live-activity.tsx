'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  ArrowUpRight,
  Info,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'agent_log' | 'security_event';
  subtype: string; // info, success, warning, error for logs; ddos, brute_force etc for security
  message: string;
  timestamp: Date;
  agentName?: string;
  agentId?: string;
}

interface LiveActivityProps {
  activities: ActivityItem[];
}

const getActivityConfig = (type: string, subtype: string) => {
  if (type === 'security_event') {
    return { icon: Shield, color: '#00d4ff' };
  }

  switch (subtype) {
    case 'success':
      return { icon: CheckCircle, color: '#00ff88' };
    case 'error':
      return { icon: XCircle, color: '#ff3b5c' };
    case 'warning':
      return { icon: AlertTriangle, color: '#ffcc00' };
    default:
      return { icon: Zap, color: '#00d4ff' };
  }
};

export function LiveActivity({ activities }: LiveActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="crypto-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Live Activity
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Info className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground mt-1">
            Activity will appear when agents start running
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Recent Activity
          </h3>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[10px] font-medium uppercase">Live</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {activities.length} events
        </span>
      </div>

      <div className="space-y-1">
        {activities.slice(0, 10).map((activity, index) => {
          const config = getActivityConfig(activity.type, activity.subtype);
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-white/[0.02] transition-colors group"
              style={{
                opacity: 1 - index * 0.06,
              }}
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded shrink-0"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <Icon className="h-3 w-3" style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate">
                  {activity.agentName && (
                    <Link
                      href={`/agents/${activity.agentId}`}
                      className="text-[#00ff88] hover:underline mr-1"
                    >
                      {activity.agentName}:
                    </Link>
                  )}
                  {activity.message}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: false })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Activity Summary */}
      <div className="mt-4 pt-4 border-t border-white/[0.06]">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-bold text-[#00ff88] font-mono">
              {activities.filter(a => a.subtype === 'success').length}
            </p>
            <p className="text-[10px] text-muted-foreground">Success</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#ffcc00] font-mono">
              {activities.filter(a => a.subtype === 'warning').length}
            </p>
            <p className="text-[10px] text-muted-foreground">Warnings</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#ff3b5c] font-mono">
              {activities.filter(a => a.subtype === 'error' || a.type === 'security_event').length}
            </p>
            <p className="text-[10px] text-muted-foreground">Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
