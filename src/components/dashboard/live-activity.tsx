'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Bot,
  Link2,
  MessageSquare,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'agent_call' | 'agent_deployed' | 'agent_error' | 'chain_executed' | 'security_event' | 'message_received';
  message: string;
  timestamp: Date;
  agent?: string;
  status?: 'success' | 'error' | 'pending';
}

interface LiveActivityProps {
  initialActivities?: ActivityItem[];
}

const typeConfig: Record<string, { icon: typeof Activity; color: string }> = {
  agent_call: { icon: Zap, color: '#00ff88' },
  agent_deployed: { icon: CheckCircle, color: '#00ff88' },
  agent_error: { icon: XCircle, color: '#ff3b5c' },
  chain_executed: { icon: Link2, color: '#bf5af2' },
  security_event: { icon: Shield, color: '#00d4ff' },
  message_received: { icon: MessageSquare, color: '#ffcc00' },
};

// Simulated live activities for demo
const demoActivities: ActivityItem[] = [
  { id: '1', type: 'agent_call', message: 'GPT-Summarizer processed document', timestamp: new Date(), agent: 'GPT-Summarizer', status: 'success' },
  { id: '2', type: 'chain_executed', message: 'Content Pipeline completed', timestamp: new Date(Date.now() - 30000), status: 'success' },
  { id: '3', type: 'message_received', message: 'New message from Telegram', timestamp: new Date(Date.now() - 60000) },
  { id: '4', type: 'security_event', message: 'Rate limit applied to 192.168.1.1', timestamp: new Date(Date.now() - 120000) },
  { id: '5', type: 'agent_call', message: 'Code-Reviewer analyzed PR #142', timestamp: new Date(Date.now() - 180000), agent: 'Code-Reviewer', status: 'success' },
  { id: '6', type: 'agent_error', message: 'Data-Scraper timeout on request', timestamp: new Date(Date.now() - 240000), agent: 'Data-Scraper', status: 'error' },
];

export function LiveActivity({ initialActivities }: LiveActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities || demoActivities);
  const [isLive, setIsLive] = useState(true);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['agent_call', 'chain_executed', 'message_received'][Math.floor(Math.random() * 3)] as ActivityItem['type'],
        message: [
          'GPT-Summarizer processed request',
          'Translation Flow executed',
          'New webhook received',
          'Sentiment analysis completed',
        ][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
        status: 'success',
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="crypto-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Live Activity
          </h3>
          {isLive && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[10px] font-medium uppercase">Live</span>
            </span>
          )}
        </div>
        <Link
          href="/activity"
          className="text-xs text-muted-foreground hover:text-[#00ff88] transition-colors flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-1">
        {activities.slice(0, 8).map((activity, index) => {
          const config = typeConfig[activity.type] || typeConfig.agent_call;
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-white/[0.02] transition-colors group"
              style={{
                opacity: 1 - index * 0.08,
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
                  {activity.message}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                {formatDistanceToNow(activity.timestamp, { addSuffix: false })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Activity Graph */}
      <div className="mt-4 pt-4 border-t border-white/[0.06]">
        <div className="flex items-end justify-between h-12 gap-1">
          {Array.from({ length: 24 }).map((_, i) => {
            const height = 20 + Math.random() * 80;
            const isRecent = i > 20;
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all hover:opacity-80"
                style={{
                  height: `${height}%`,
                  backgroundColor: isRecent ? '#00ff88' : 'rgba(0,255,136,0.3)',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>24h ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
}
