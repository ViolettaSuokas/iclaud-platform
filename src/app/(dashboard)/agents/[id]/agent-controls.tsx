'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Square, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentControlsProps {
  agentId: string;
  currentStatus: string;
}

export function AgentControls({ agentId, currentStatus }: AgentControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: 'start' | 'stop' | 'restart' | 'delete') => {
    setLoading(action);
    try {
      const res = await fetch(`/api/agents/${agentId}/${action}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Action failed');
      }

      if (action === 'delete') {
        router.push('/agents');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(`Failed to ${action} agent:`, error);
      alert(`Failed to ${action} agent`);
    } finally {
      setLoading(null);
    }
  };

  const isRunning = currentStatus === 'running';
  const isStopped = currentStatus === 'stopped' || currentStatus === 'error';

  return (
    <div className="flex items-center gap-2">
      {isStopped && (
        <Button
          onClick={() => handleAction('start')}
          disabled={loading !== null}
          className="bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#05050a] font-semibold"
        >
          {loading === 'start' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Start
        </Button>
      )}

      {isRunning && (
        <>
          <Button
            onClick={() => handleAction('stop')}
            disabled={loading !== null}
            variant="outline"
            className="border-[#ff3b5c]/30 text-[#ff3b5c] hover:bg-[#ff3b5c]/10"
          >
            {loading === 'stop' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Square className="h-4 w-4 mr-2" />
            )}
            Stop
          </Button>
          <Button
            onClick={() => handleAction('restart')}
            disabled={loading !== null}
            variant="outline"
            className="border-white/10"
          >
            {loading === 'restart' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Restart
          </Button>
        </>
      )}

      <Button
        onClick={() => {
          if (confirm('Are you sure you want to delete this agent?')) {
            handleAction('delete');
          }
        }}
        disabled={loading !== null}
        variant="ghost"
        className="text-muted-foreground hover:text-[#ff3b5c] hover:bg-[#ff3b5c]/10"
      >
        {loading === 'delete' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
