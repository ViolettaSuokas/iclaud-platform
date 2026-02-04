'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Cloud,
  Bot,
  Link2,
  Shield,
  Store,
  Key,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clouds', href: '/clouds', icon: Cloud },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Chains', href: '/chains', icon: Link2 },
  { name: 'ShellGuard', href: '/security', icon: Shield },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
];

const secondaryNavigation = [
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Docs', href: '/docs', icon: HelpCircle },
];

interface SidebarProps {
  credits?: number;
}

export function Sidebar({ credits = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-[#08080d]/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00ff88] shadow-lg shadow-[#00ff88]/20">
          <Zap className="h-5 w-5 text-[#05050a]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-wider">
            <span className="text-[#00d4ff]">i</span>
            <span className="text-white">Claud</span>
          </span>
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Agent Cloud
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2 px-3">
          <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
            Platform
          </span>
        </div>
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border-l-2 border-[#00ff88] ml-[-2px]'
                    : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
                )}
              >
                <item.icon className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-[#00ff88]' : 'text-muted-foreground group-hover:text-foreground'
                )} />
                {item.name}
                {item.name === 'ShellGuard' && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#00ff88]/20 text-[#00ff88] uppercase tracking-wider">
                    Active
                  </span>
                )}
                {isActive && item.name !== 'ShellGuard' && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-white/[0.06]" />

        <div className="mb-2 px-3">
          <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
            Account
          </span>
        </div>
        <div className="space-y-0.5">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border-l-2 border-[#00ff88] ml-[-2px]'
                    : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Credits */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-lg bg-gradient-to-br from-[#0c0c12] to-[#080810] p-4 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
              Credits
            </span>
            <span className="text-lg font-bold text-[#00ff88] font-mono">
              ${credits.toFixed(2)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] transition-all duration-500 shadow-[0_0_10px_rgba(0,255,136,0.5)]"
              style={{ width: `${Math.min((credits / 10) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Free Tier</span>
            <Link
              href="/billing"
              className="text-[10px] text-[#00d4ff] hover:text-[#00ff88] transition-colors"
            >
              Upgrade →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
