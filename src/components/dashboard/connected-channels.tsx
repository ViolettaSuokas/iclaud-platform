'use client';

import { useState } from 'react';
import {
  Plus,
  Settings,
  Mail,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Brand icons as SVG components
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const TelegramIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const SlackIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const DiscordIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
  </svg>
);

const WhatsAppIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface Channel {
  id: string;
  name: string;
  icon: React.ComponentType<IconProps>;
  connected: boolean;
  messages?: number;
  color: string;
}

const channels: Channel[] = [
  { id: 'telegram', name: 'Telegram', icon: TelegramIcon, connected: true, messages: 1247, color: '#0088cc' },
  { id: 'slack', name: 'Slack', icon: SlackIcon, connected: true, messages: 856, color: '#4a154b' },
  { id: 'discord', name: 'Discord', icon: DiscordIcon, connected: true, messages: 432, color: '#5865f2' },
  { id: 'whatsapp', name: 'WhatsApp', icon: WhatsAppIcon, connected: false, color: '#25d366' },
  { id: 'email', name: 'Email', icon: Mail, connected: true, messages: 2103, color: '#ea4335' },
  { id: 'webhook', name: 'Webhooks', icon: Link2, connected: true, messages: 5670, color: '#6b7280' },
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
            <channel.icon className="h-6 w-6 mb-1" style={{ color: channel.connected ? channel.color : undefined }} />
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
