'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Info, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Log {
  id: string;
  type: string;
  message: string;
  metadata: string | null;
  createdAt: Date;
}

interface AgentLogsProps {
  logs: Log[];
  agentId: string;
}

const logTypeConfig: Record<string, { icon: typeof Info; color: string }> = {
  info: { icon: Info, color: '#00d4ff' },
  success: { icon: CheckCircle, color: '#00ff88' },
  warning: { icon: AlertTriangle, color: '#ffcc00' },
  error: { icon: AlertCircle, color: '#ff3b5c' },
};

export function AgentLogs({ logs, agentId }: AgentLogsProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.type === filter);

  const handleRefresh = () => {
    router.refresh();
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Info className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No logs yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Logs will appear here when the agent is running
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['all', 'info', 'success', 'warning', 'error'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === type
                  ? 'bg-white/10 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Log entries */}
      <div className="bg-black/30 rounded-lg max-h-[500px] overflow-y-auto font-mono text-xs">
        {filteredLogs.map((log) => {
          const config = logTypeConfig[log.type] || logTypeConfig.info;
          const Icon = config.icon;

          return (
            <div
              key={log.id}
              className="flex items-start gap-3 px-3 py-2 border-b border-white/[0.03] hover:bg-white/[0.02]"
            >
              <Icon
                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                style={{ color: config.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-foreground break-words">{log.message}</p>
                {log.metadata && (
                  <pre className="mt-1 text-muted-foreground text-[10px] overflow-x-auto">
                    {log.metadata}
                  </pre>
                )}
              </div>
              <span className="text-muted-foreground shrink-0 text-[10px]">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </span>
            </div>
          );
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No {filter} logs
        </div>
      )}
    </div>
  );
}
