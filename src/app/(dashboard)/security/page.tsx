import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Lock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const severityConfig: Record<string, { color: string; icon: typeof AlertTriangle; label: string }> = {
  high: { color: '#ff3b5c', icon: XCircle, label: 'High' },
  medium: { color: '#ffcc00', icon: AlertTriangle, label: 'Medium' },
  low: { color: '#00d4ff', icon: CheckCircle, label: 'Low' },
};

const typeLabels: Record<string, string> = {
  ddos_attempt: 'DDoS Attack',
  brute_force: 'Brute Force',
  rate_limit: 'Rate Limited',
  suspicious_payload: 'Suspicious Payload',
  unauthorized_access: 'Unauthorized Access',
};

export default async function SecurityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const events = await prisma.securityEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const stats = {
    totalBlocked: events.filter((e) => e.blocked).length,
    highSeverity: events.filter((e) => e.severity === 'high').length,
    last24h: events.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#00ff88]/15 flex items-center justify-center">
            <Shield className="h-6 w-6 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">ShellGuard</h2>
            <p className="text-[#00ff88] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
              Protection Active
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#00ff88]/15 flex items-center justify-center">
              <Lock className="h-5 w-5 text-[#00ff88]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Threats Blocked</span>
          </div>
          <p className="text-3xl font-bold text-[#00ff88] font-mono">{stats.totalBlocked}</p>
        </div>

        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#ff3b5c]/15 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-[#ff3b5c]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">High Severity</span>
          </div>
          <p className="text-3xl font-bold text-[#ff3b5c] font-mono">{stats.highSeverity}</p>
        </div>

        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#00d4ff]/15 flex items-center justify-center">
              <Activity className="h-5 w-5 text-[#00d4ff]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Last 24h</span>
          </div>
          <p className="text-3xl font-bold text-[#00d4ff] font-mono">{stats.last24h}</p>
        </div>
      </div>

      {/* Protection Features */}
      <div className="crypto-card rounded-lg p-6">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
          Active Protections
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'DDoS Protection', status: 'active' },
            { name: 'Brute Force Guard', status: 'active' },
            { name: 'Rate Limiting', status: 'active' },
            { name: 'Payload Scanner', status: 'active' },
          ].map((feature) => (
            <div
              key={feature.name}
              className="flex items-center gap-3 p-3 rounded-md bg-white/[0.02] border border-white/[0.04]"
            >
              <CheckCircle className="h-4 w-4 text-[#00ff88]" />
              <span className="text-sm">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events Log */}
      <div className="crypto-card rounded-lg p-6">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
          Security Events
        </h3>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No security events recorded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const severity = severityConfig[event.severity] || severityConfig.low;
              const Icon = severity.icon;

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-md bg-white/[0.02] border border-white/[0.04]"
                >
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${severity.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: severity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {typeLabels[event.type] || event.type}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold"
                        style={{
                          backgroundColor: `${severity.color}20`,
                          color: severity.color,
                        }}
                      >
                        {severity.label}
                      </span>
                      {event.blocked && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00ff88]/20 text-[#00ff88] uppercase font-bold">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {event.source && <span>Source: {event.source}</span>}
                      {event.target && <span>Target: {event.target}</span>}
                      <span>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
