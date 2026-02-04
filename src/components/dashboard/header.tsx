'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Settings, User, Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  user: {
    name: string | null;
    email: string;
    credits?: number;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <button className="flex items-center gap-3 h-9 px-4 rounded-md bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:bg-white/[0.05] hover:border-white/[0.1] transition-all max-w-sm flex-1">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search...</span>
          <div className="ml-auto flex items-center gap-1 text-xs">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] font-mono">
              <Command className="h-3 w-3" />
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] font-mono">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-md hover:bg-white/[0.05]"
            >
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarFallback className="rounded-md bg-[#00ff88] text-[#05050a] text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-[#0c0c12]/95 backdrop-blur-xl border-white/[0.08]"
            align="end"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={() => router.push('/settings/profile')}
              className="cursor-pointer hover:bg-white/[0.05] focus:bg-white/[0.05]"
            >
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer hover:bg-white/[0.05] focus:bg-white/[0.05]"
            >
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-[#ff3b5c] hover:bg-[#ff3b5c]/10 focus:bg-[#ff3b5c]/10 focus:text-[#ff3b5c]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
