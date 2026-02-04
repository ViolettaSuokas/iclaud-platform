'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Plus,
  Check,
  X,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Channel {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  messages?: number;
  color: string;
}

const channels: Channel[] = [
  { id: 'telegram', name: 'Telegram', icon: '✈️', connected: true, messages: 1247, color: '#0088cc' },
  { id: 'slack', name: 'Slack', icon: '💬', connected: true, messages: 856, color: '#4a154b' },
  { id: 'discord', name: 'Discord', icon: '🎮', connected: true, messages: 432, color: '#5865f2' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '📱', connected: false, color: '#25d366' },
  { id: 'email', name: 'Email', icon: '📧', connected: true, messages: 2103, color: '#ea4335' },
  { id: 'webhook', name: 'Webhooks', icon: '🔗', connected: true, messages: 5670, color: '#ff6b6b' },
];

export function ConnectedChannels() {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  const connectedCount = channels.filter(c => c.connected).length;
  const totalMessages = channels.reduce((acc, c) => acc + (c.messages || 0), 0);

  return (
    <div className="crypto-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Connected Channels
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {connectedCount} of {channels.length} connected
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-3 w-3 mr-1" />
          Manage
        </Button>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onMouseEnter={() => setHoveredChannel(channel.id)}
            onMouseLeave={() => setHoveredChannel(null)}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all
              ${channel.connected
                ? 'bg-white/[0.02] border-white/[0.06] hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5'
                : 'bg-white/[0.01] border-dashed border-white/[0.04] opacity-50 hover:opacity-70'
              }
            `}
          >
            <span className="text-xl mb-1">{channel.icon}</span>
            <span className="text-[10px] text-muted-foreground">{channel.name}</span>

            {/* Status indicator */}
            <span
              className={`
                absolute top-1.5 right-1.5 h-2 w-2 rounded-full
                ${channel.connected ? 'bg-[#00ff88]' : 'bg-muted-foreground/30'}
              `}
              style={{
                boxShadow: channel.connected ? '0 0 6px rgba(0,255,136,0.6)' : 'none'
              }}
            />

            {/* Hover tooltip */}
            {hoveredChannel === channel.id && channel.connected && channel.messages && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0c0c12] border border-white/[0.1] rounded text-[10px] whitespace-nowrap z-10">
                {channel.messages.toLocaleString()} messages
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
        <div className="text-center">
          <p className="text-lg font-bold text-[#00ff88] font-mono">
            {totalMessages.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Total Messages
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#00d4ff] font-mono">
            99.8%
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Delivery Rate
          </p>
        </div>
      </div>

      {/* Connect new */}
      <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/[0.08] text-xs text-muted-foreground hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-colors">
        <Plus className="h-3 w-3" />
        Connect Channel
      </button>
    </div>
  );
}
