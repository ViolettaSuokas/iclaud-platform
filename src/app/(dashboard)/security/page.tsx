import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Lock,
  Globe,
  Ban,
  TrendingDown,
  Zap,
  Server,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

const severityConfig: Record<string, { color: string; icon: typeof AlertTriangle; label: string }> = {
  high: { color: '#ff3b5c', icon: XCircle, label: 'High' },
  medium: { color: '#ffcc00', icon: AlertTriangle, label: 'Medium' },
  low: { color: '#00d4ff', icon: CheckCircle, label: 'Low' },
};

const typeConfig: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  ddos_attempt: { label: 'DDoS Attack', icon: Zap, color: '#ff3b5c' },
  brute_force: { label: 'Brute Force', icon: Lock, color: '#ff9500' },
  rate_limit: { label: 'Rate Limited', icon: Activity, color: '#ffcc00' },
  suspicious_payload: { label: 'Suspicious Payload', icon: AlertTriangle, color: '#bf5af2' },
  unauthorized_access: { label: 'Unauthorized Access', icon: Ban, color: '#ff375f' },
  sql_injection: { label: 'SQL Injection', icon: Server, color: '#ff3b5c' },
};

export default async function SecurityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Fetch security events and user's agents
  const [events, agents] = await Promise.all([
    prisma.securityEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.agent.findMany({
      where: { cloud: { userId } },
      select: { id: true, name: true, endpoint: true },
    }),
  ]);

  // Calculate stats
  const totalBlocked = events.filter((e) => e.blocked).length;
  const highSeverity = events.filter((e) => e.severity === 'high').length;
  const last24h = events.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
  const last7days = events.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  // Calculate Security Score (0-100)
  const blockedRate = events.length > 0 ? (totalBlocked / events.length) * 100 : 100;
  const noHighSeverity = highSeverity === 0 ? 20 : Math.max(0, 20 - highSeverity * 2);
  const securityScore = Math.min(100, Math.round(blockedRate * 0.6 + noHighSeverity + 20));

  // Group by attack type
  const attackTypes = events.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedAttackTypes = Object.entries(attackTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Group by source IP
  const topSources = events
    .filter((e) => e.source)
    .reduce((acc, e) => {
      acc[e.source!] = (acc[e.source!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedSources = Object.entries(topSources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Group by target (agents)
  const targetedAgents = events
    .filter((e) => e.target)
    .reduce((acc, e) => {
      acc[e.target!] = (acc[e.target!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedTargets = Object.entries(targetedAgents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Score color
  const scoreColor = securityScore >= 80 ? '#00ff88' : securityScore >= 50 ? '#ffcc00' : '#ff3b5c';

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <Button variant="outline" className="border-white/10">
          <Eye className="h-4 w-4 mr-2" />
          View Report
        </Button>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Security Score */}
        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Security Score</span>
            {securityScore >= 80 ? (
              <ShieldCheck className="h-5 w-5 text-[#00ff88]" />
            ) : (
              <ShieldAlert className="h-5 w-5" style={{ color: scoreColor }} />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-mono" style={{ color: scoreColor }}>
              {securityScore}
            </span>
            <span className="text-muted-foreground mb-1">/100</span>
          </div>
          <div className="mt-3 h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${securityScore}%`, backgroundColor: scoreColor }}
            />
          </div>
        </div>

        {/* Threats Blocked */}
        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#00ff88]/15 flex items-center justify-center">
              <Lock className="h-5 w-5 text-[#00ff88]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Blocked</span>
          </div>
          <p className="text-3xl font-bold text-[#00ff88] font-mono">{totalBlocked}</p>
          <p className="text-xs text-muted-foreground mt-1">of {events.length} total threats</p>
        </div>

        {/* High Severity */}
        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#ff3b5c]/15 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-[#ff3b5c]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Critical</span>
          </div>
          <p className="text-3xl font-bold text-[#ff3b5c] font-mono">{highSeverity}</p>
          <p className="text-xs text-muted-foreground mt-1">high severity events</p>
        </div>

        {/* Last 24h */}
        <div className="crypto-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#00d4ff]/15 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#00d4ff]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">24h Activity</span>
          </div>
          <p className="text-3xl font-bold text-[#00d4ff] font-mono">{last24h}</p>
          <p className="text-xs text-muted-foreground mt-1">{last7days} in last 7 days</p>
        </div>
      </div>

      {/* Middle Row: Attack Types + Top Sources + Targeted Agents */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attack Types Breakdown */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#ff3b5c]" />
            Attack Types
          </h3>
          {sortedAttackTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No attacks recorded</p>
          ) : (
            <div className="space-y-3">
              {sortedAttackTypes.map(([type, count]) => {
                const config = typeConfig[type] || { label: type, icon: Shield, color: '#6b7280' };
                const percentage = Math.round((count / events.length) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{config.label}</span>
                      <span className="text-xs text-muted-foreground font-mono">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: config.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Blocked Sources */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#ffcc00]" />
            Top Blocked IPs
          </h3>
          {sortedSources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sources recorded</p>
          ) : (
            <div className="space-y-2">
              {sortedSources.map(([ip, count], index) => (
                <div
                  key={ip}
                  className="flex items-center justify-between p-2 rounded-md bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                    <code className="text-sm font-mono">{ip}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">{count}x</span>
                    <button className="p-1 rounded hover:bg-[#ff3b5c]/20 text-muted-foreground hover:text-[#ff3b5c] transition-colors">
                      <Ban className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Targeted Agents */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Server className="h-4 w-4 text-[#bf5af2]" />
            Most Targeted
          </h3>
          {sortedTargets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No targets recorded</p>
          ) : (
            <div className="space-y-2">
              {sortedTargets.map(([target, count]) => (
                <div
                  key={target}
                  className="flex items-center justify-between p-2 rounded-md bg-white/[0.02]"
                >
                  <span className="text-sm truncate">{target}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#bf5af2]/20 text-[#bf5af2] font-mono">
                      {count} attacks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Protections */}
      <div className="crypto-card rounded-lg p-6">
        <h3 className="text-sm font-medium uppercase tracking-wider mb-4">
          Active Protections
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'DDoS Protection', description: 'Mitigates volumetric attacks', status: 'active' },
            { name: 'Brute Force Guard', description: 'Blocks repeated login attempts', status: 'active' },
            { name: 'Rate Limiting', description: '100 req/min per IP', status: 'active' },
            { name: 'Payload Scanner', description: 'Detects SQL/XSS injections', status: 'active' },
            { name: 'Bot Detection', description: 'Filters automated traffic', status: 'active' },
            { name: 'Geo-blocking', description: 'Block by country', status: 'inactive' },
            { name: 'IP Whitelist', description: 'Allow trusted IPs only', status: 'inactive' },
            { name: 'WAF Rules', description: 'Custom firewall rules', status: 'active' },
          ].map((feature) => (
            <div
              key={feature.name}
              className={`flex items-start gap-3 p-3 rounded-md border transition-all ${
                feature.status === 'active'
                  ? 'bg-[#00ff88]/5 border-[#00ff88]/20'
                  : 'bg-white/[0.01] border-white/[0.04] opacity-50'
              }`}
            >
              {feature.status === 'active' ? (
                <CheckCircle className="h-4 w-4 text-[#00ff88] mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-sm font-medium">{feature.name}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Log */}
      <div className="crypto-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium uppercase tracking-wider">
            Security Events
          </h3>
          <span className="text-xs text-muted-foreground">
            Showing {Math.min(events.length, 20)} of {events.length}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="h-12 w-12 text-[#00ff88] mx-auto mb-4" />
            <p className="text-foreground font-medium">All Clear</p>
            <p className="text-sm text-muted-foreground mt-1">No security events recorded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 20).map((event) => {
              const severity = severityConfig[event.severity] || severityConfig.low;
              const Icon = severity.icon;

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-md bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${severity.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: severity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-sm">
                        {typeConfig[event.type]?.label || event.type}
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
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      {event.source && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {event.source}
                        </span>
                      )}
                      {event.target && (
                        <span className="flex items-center gap-1">
                          <Server className="h-3 w-3" />
                          {event.target}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                      </span>
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
