'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Cloud,
  Link2,
  Shield,
  Settings,
  Search,
  Plus,
  Zap,
  Key,
  LogOut,
  LayoutDashboard,
  Store,
  FileText,
  Play,
  Square,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, shortcut: 'G D', action: () => router.push('/dashboard'), category: 'Navigation' },
    { id: 'agents', label: 'Go to Agents', icon: Bot, shortcut: 'G A', action: () => router.push('/agents'), category: 'Navigation' },
    { id: 'clouds', label: 'Go to Clouds', icon: Cloud, shortcut: 'G C', action: () => router.push('/clouds'), category: 'Navigation' },
    { id: 'chains', label: 'Go to Chains', icon: Link2, shortcut: 'G H', action: () => router.push('/chains'), category: 'Navigation' },
    { id: 'security', label: 'Go to ShellGuard', icon: Shield, shortcut: 'G S', action: () => router.push('/security'), category: 'Navigation' },
    { id: 'marketplace', label: 'Go to Marketplace', icon: Store, shortcut: 'G M', action: () => router.push('/marketplace'), category: 'Navigation' },

    // Actions
    { id: 'new-agent', label: 'Deploy New Agent', icon: Plus, shortcut: 'N A', action: () => router.push('/agents/new'), category: 'Actions' },
    { id: 'new-chain', label: 'Create New Chain', icon: Plus, shortcut: 'N C', action: () => router.push('/chains/new'), category: 'Actions' },
    { id: 'new-cloud', label: 'Create New Cloud', icon: Plus, shortcut: 'N L', action: () => router.push('/clouds/new'), category: 'Actions' },

    // Settings
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: ',', action: () => router.push('/settings'), category: 'Settings' },
    { id: 'api-keys', label: 'API Keys', icon: Key, action: () => router.push('/api-keys'), category: 'Settings' },
    { id: 'docs', label: 'Documentation', icon: FileText, action: () => window.open('/docs', '_blank'), category: 'Settings' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const flatCommands = Object.values(groupedCommands).flat();

  React.useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % flatCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flatCommands.length) % flatCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatCommands[selectedIndex]) {
        flatCommands[selectedIndex].action();
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-lg bg-[#0c0c12]/95 backdrop-blur-xl border-white/[0.08] overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.06] border border-white/[0.1] rounded text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category}>
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {category}
                </span>
              </div>
              {items.map((cmd) => {
                const globalIndex = flatCommands.indexOf(cmd);
                const isSelected = globalIndex === selectedIndex;

                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      onOpenChange(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                      isSelected
                        ? 'bg-[#00ff88]/10 text-[#00ff88]'
                        : 'text-foreground hover:bg-white/[0.03]'
                    )}
                  >
                    <cmd.icon className={cn(
                      'h-4 w-4',
                      isSelected ? 'text-[#00ff88]' : 'text-muted-foreground'
                    )} />
                    <span className="flex-1 text-left">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.06] border border-white/[0.1] rounded text-muted-foreground">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {flatCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No commands found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-[#00ff88]">iClaud</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for keyboard shortcut
export function useCommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return { open, setOpen };
}
