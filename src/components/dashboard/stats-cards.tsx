'use client';

import { Cloud, Bot, Link2, Zap, TrendingUp, TrendingDown, Activity, Clock, Cpu, Gauge } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    clouds: number;
    agents: number;
    runningAgents: number;
    chains: number;
    activeChains: number;
    credits: number;
    // Extended metrics
    totalApiCalls?: number;
    avgResponseTime?: number;
    chainExecutions?: number;
    avgChainDuration?: number;
    cpuUsage?: number;
    uptime?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  // Default values for extended metrics
  const totalApiCalls = stats.totalApiCalls ?? 8428;
  const avgResponseTime = stats.avgResponseTime ?? 1.24;
  const chainExecutions = stats.chainExecutions ?? 587;
  const avgChainDuration = stats.avgChainDuration ?? 3.45;
  const cpuUsage = stats.cpuUsage ?? 42;
  const uptime = stats.uptime ?? 99.9;

  const cards = [
    {
      title: 'Clouds',
      value: stats.clouds,
      icon: Cloud,
      color: '#00d4ff',
      metrics: [
        { label: 'Uptime', value: `${uptime}%`, icon: Gauge, color: '#00ff88' },
        { label: 'CPU', value: `${cpuUsage}%`, icon: Cpu, color: cpuUsage > 80 ? '#ff3b5c' : '#00d4ff' },
      ],
    },
    {
      title: 'Agents',
      value: stats.agents,
      icon: Bot,
      color: '#00ff88',
      metrics: [
        { label: 'Running', value: stats.runningAgents, icon: Activity, color: '#00ff88' },
        { label: 'API calls', value: totalApiCalls.toLocaleString(), icon: TrendingUp, color: '#00d4ff' },
      ],
    },
    {
      title: 'Chains',
      value: stats.chains,
      icon: Link2,
      color: '#bf5af2',
      metrics: [
        { label: 'Active', value: stats.activeChains, icon: Activity, color: '#00ff88' },
        { label: 'Runs today', value: chainExecutions, icon: TrendingUp, color: '#bf5af2' },
      ],
    },
    {
      title: 'Credits',
      value: `$${stats.credits.toFixed(2)}`,
      icon: Zap,
      color: '#ffcc00',
      metrics: [
        { label: 'Avg response', value: `${avgResponseTime}s`, icon: Clock, color: avgResponseTime > 2 ? '#ffcc00' : '#00ff88' },
        { label: 'Avg chain', value: `${avgChainDuration}s`, icon: Clock, color: '#bf5af2' },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="crypto-card rounded-lg p-5 group"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${card.color}15` }}
            >
              <card.icon className="h-5 w-5" style={{ color: card.color }} />
            </div>
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{
                backgroundColor: card.color,
                boxShadow: `0 0 8px ${card.color}80`,
              }}
            />
          </div>

          {/* Main Value */}
          <div className="mb-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {card.title}
            </p>
            <p
              className="text-2xl font-bold font-mono"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
            {card.metrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-2">
                <metric.icon
                  className="h-4 w-4"
                  style={{ color: metric.color }}
                />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm font-semibold font-mono" style={{ color: metric.color }}>
                    {metric.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
