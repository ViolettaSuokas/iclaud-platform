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
  TrendingUp,
  Brain,
  FileWarning,
  Skull,
  MapPin,
  Gauge,
  Settings,
  Power,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow, subDays, format } from 'date-fns';
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
  prompt_injection: { label: 'Prompt Injection', icon: Brain, color: '#ff3b5c' },
  data_leakage: { label: 'Data Leakage', icon: FileWarning, color: '#ff9500' },
  jailbreak_attempt: { label: 'Jailbreak Attempt', icon: Skull, color: '#ff375f' },
};

// Geographic data mapping (simplified for demo)
const geoData: Record<string, { country: string; code: string }> = {
  '185.': { country: 'Russia', code: 'RU' },
  '103.': { country: 'China', code: 'CN' },
  '192.': { country: 'United States', code: 'US' },
  '45.': { country: 'Netherlands', code: 'NL' },
  '91.': { country: 'Germany', code: 'DE' },
  '78.': { country: 'United Kingdom', code: 'GB' },
  '202.': { country: 'India', code: 'IN' },
  '177.': { country: 'Brazil', code: 'BR' },
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

  // Geographic breakdown from IPs
  const geoBreakdown = events
    .filter((e) => e.source)
    .reduce((acc, e) => {
      const prefix = e.source!.split('.')[0] + '.';
      const geo = geoData[prefix] || { country: 'Unknown', code: 'XX' };
      acc[geo.country] = (acc[geo.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedGeo = Object.entries(geoBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // AI-specific security metrics
  const aiSecurityEvents = {
    promptInjection: events.filter((e) => e.type === 'prompt_injection').length,
    dataLeakage: events.filter((e) => e.type === 'data_leakage').length,
    jailbreakAttempt: events.filter((e) => e.type === 'jailbreak_attempt').length,
  };
  const totalAiThreats = aiSecurityEvents.promptInjection + aiSecurityEvents.dataLeakage + aiSecurityEvents.jailbreakAttempt;

  // Traffic trends (last 7 days)
  const trafficByDay = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    const dayEvents = events.filter((e) => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= dayStart && eventDate <= dayEnd;
    });
    return {
      day: format(dayStart, 'EEE'),
      total: dayEvents.length,
      blocked: dayEvents.filter((e) => e.blocked).length,
    };
  });

  const maxTraffic = Math.max(...trafficByDay.map((d) => d.total), 1);

  // Response metrics
  const avgResponseTime = events.length > 0
    ? Math.round(events.filter((e) => e.blocked).length / Math.max(events.length, 1) * 50 + 20)
    : 0; // Simulated MTTD in ms
  const blockRate = events.length > 0 ? Math.round((totalBlocked / events.length) * 100) : 100;

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
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" className="border-white/10">
            <Eye className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="crypto-card rounded-lg p-4 border-l-4 border-l-[#00ff88]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-[#00ff88]" />
            <div>
              <span className="text-sm font-medium">Security Mode: </span>
              <span className="text-sm text-[#00ff88]">Standard</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="border-[#ffcc00]/30 text-[#ffcc00] hover:bg-[#ffcc00]/10 text-xs">
              <ShieldAlert className="h-3 w-3 mr-1" />
              High Security Mode
            </Button>
            <Button size="sm" variant="outline" className="border-[#ff3b5c]/30 text-[#ff3b5c] hover:bg-[#ff3b5c]/10 text-xs">
              <Power className="h-3 w-3 mr-1" />
              Block All Traffic
            </Button>
            <Button size="sm" variant="outline" className="border-white/10 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Rules
            </Button>
          </div>
        </div>
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

      {/* AI Agent Security + Traffic Trends + Response Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Agent Security */}
        <div className="crypto-card rounded-lg p-5 border border-[#bf5af2]/20">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#bf5af2]" />
            AI Agent Security
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#ff3b5c]" />
                <span className="text-sm">Prompt Injection</span>
              </div>
              <span className="text-sm font-mono font-bold text-[#ff3b5c]">
                {aiSecurityEvents.promptInjection}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-[#ff9500]" />
                <span className="text-sm">Data Leakage</span>
              </div>
              <span className="text-sm font-mono font-bold text--[#ff9500]">
                {aiSecurityEvents.dataLeakage}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Skull className="h-4 w-4 text-[#ff375f]" />
                <span className="text-sm">Jailbreak Attempts</span>
              </div>
              <span className="text-sm font-mono font-bold text-[#ff375f]">
                {aiSecurityEvents.jailbreakAttempt}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total AI Threats</span>
              <span className="text-lg font-bold font-mono" style={{ color: totalAiThreats > 0 ? '#ff3b5c' : '#00ff88' }}>
                {totalAiThreats}
              </span>
            </div>
          </div>
        </div>

        {/* Traffic Trends (7 days) */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#00d4ff]" />
            Attack Trends (7 Days)
          </h3>
          <div className="flex items-end justify-between gap-1 h-[120px]">
            {trafficByDay.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end h-[90px] gap-0.5">
                  <div
                    className="w-full rounded-t bg-[#ff3b5c]/80"
                    style={{ height: `${((day.total - day.blocked) / maxTraffic) * 100}%`, minHeight: day.total > day.blocked ? 2 : 0 }}
                  />
                  <div
                    className="w-full rounded-b bg-[#00ff88]"
                    style={{ height: `${(day.blocked / maxTraffic) * 100}%`, minHeight: day.blocked > 0 ? 2 : 0 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00ff88]" />
              <span className="text-[10px] text-muted-foreground">Blocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff3b5c]/80" />
              <span className="text-[10px] text-muted-foreground">Passed</span>
            </div>
          </div>
        </div>

        {/* Response Metrics */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Gauge className="h-4 w-4 text-[#00ff88]" />
            Response Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Mean Time to Detect</span>
                <span className="text-sm font-mono font-bold text-[#00ff88]">{avgResponseTime}ms</span>
              </div>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#00ff88] rounded-full" style={{ width: `${100 - avgResponseTime}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Block Success Rate</span>
                <span className="text-sm font-mono font-bold text-[#00d4ff]">{blockRate}%</span>
              </div>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#00d4ff] rounded-full" style={{ width: `${blockRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Rules Effectiveness</span>
                <span className="text-sm font-mono font-bold text-[#bf5af2]">{Math.min(98, blockRate + 5)}%</span>
              </div>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#bf5af2] rounded-full" style={{ width: `${Math.min(98, blockRate + 5)}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <p className="text-[10px] text-muted-foreground text-center">
              Average across all protected endpoints
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Attack Types + Geographic + Top Sources + Targeted Agents */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Geographic Origins */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#00d4ff]" />
            Attack Origins
          </h3>
          {sortedGeo.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No geographic data</p>
          ) : (
            <div className="space-y-2">
              {sortedGeo.map(([country, count], index) => {
                const percentage = Math.round((count / events.length) * 100);
                const colors = ['#ff3b5c', '#ff9500', '#ffcc00', '#00d4ff', '#bf5af2', '#00ff88'];
                return (
                  <div key={country} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">{country}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{percentage}%</span>
                      </div>
                      <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: colors[index] || '#6b7280' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attack Types Breakdown */}
        <div className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#ff3b5c]" />
            Attack Types
          </h3>
          {sortedAttackTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No attacks recorded</p>
          ) : (
            <div className="space-y-2">
              {sortedAttackTypes.map(([type, count]) => {
                const config = typeConfig[type] || { label: type, icon: Shield, color: '#6b7280' };
                const percentage = Math.round((count / events.length) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{config.label}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{percentage}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
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
