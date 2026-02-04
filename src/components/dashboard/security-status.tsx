'use client';

import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  source: string | null;
  target: string | null;
  description: string;
  blocked: boolean;
  createdAt: Date;
}

interface SecurityStatusProps {
  events: SecurityEvent[];
  totalBlocked: number;
}

const severityConfig: Record<string, { color: string; icon: typeof AlertTriangle }> = {
  high: { color: '#ff3b5c', icon: XCircle },
  medium: { color: '#ffcc00', icon: AlertTriangle },
  low: { color: '#00d4ff', icon: CheckCircle },
};

const typeLabels: Record<string, string> = {
  ddos_attempt: 'DDoS Attack',
  brute_force: 'Brute Force',
  rate_limit: 'Rate Limited',
  suspicious_payload: 'Suspicious Payload',
};

export function SecurityStatus({ events, totalBlocked }: SecurityStatusProps) {
  return (
    <div className="crypto-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ff88]/15">
            <Shield className="h-5 w-5 text-[#00ff88]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
              ShellGuard
            </h3>
            <p className="text-xs text-[#00ff88]">Protection Active</p>
          </div>
        </div>
        <Link
          href="/security"
          className="text-xs text-muted-foreground hover:text-[#00ff88] transition-colors flex items-center gap-1"
        >
          Details
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
          <p className="text-xs text-muted-foreground">Threats Blocked</p>
          <p className="text-xl font-bold text-[#00ff88] font-mono">{totalBlocked}</p>
        </div>
        <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="text-sm font-medium text-[#00ff88] flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
            Protected
          </p>
        </div>
      </div>

      {/* Recent events */}
      {events.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Recent Events</p>
          {events.slice(0, 3).map((event) => {
            const severity = severityConfig[event.severity] || severityConfig.low;
            const Icon = severity.icon;

            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-2 rounded-md bg-white/[0.01]"
              >
                <Icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: severity.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {typeLabels[event.type] || event.type}
                    </span>
                    {event.blocked && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-[#00ff88]/20 text-[#00ff88] uppercase font-bold">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
