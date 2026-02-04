'use client';

import { Cloud, Bot, Link2, Zap } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    clouds: number;
    agents: number;
    runningAgents: number;
    chains: number;
    activeChains: number;
    credits: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Clouds',
      value: stats.clouds,
      icon: Cloud,
      subtitle: '3 regions',
      color: '#00d4ff',
    },
    {
      title: 'Agents',
      value: stats.agents,
      icon: Bot,
      subtitle: `${stats.runningAgents} running`,
      color: '#00ff88',
    },
    {
      title: 'Chains',
      value: stats.chains,
      icon: Link2,
      subtitle: `${stats.activeChains} active`,
      color: '#bf5af2',
    },
    {
      title: 'Credits',
      value: `$${stats.credits.toFixed(2)}`,
      icon: Zap,
      subtitle: 'Free tier',
      color: '#ffcc00',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="crypto-card rounded-lg p-5 group"
        >
          <div className="flex items-start justify-between mb-4">
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
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {card.title}
            </p>
            <p
              className="text-2xl font-bold font-mono"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground">
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
