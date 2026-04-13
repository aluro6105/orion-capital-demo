import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Bell, ChevronDown, Menu, LogOut, User, Settings, FlaskConical, Building2 } from 'lucide-react';
import { useAccount } from './AccountContext';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function PortalHeader({ onMenuToggle }) {
  const { user, activeType, activeAccount, demoAccount, realAccount, switchAccount } = useAccount();

  const { data: notifs = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => base44.entities.Notification.filter({ user_id: user.id, read: false }),
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const unread = notifs.length;

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    window.location.href = '/';
  };

  return (
    <header className="h-14 bg-[#0f1117] border-b border-[#1e2130] flex items-center justify-between px-4 gap-4 flex-shrink-0">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden text-[#8b8fa8] hover:text-white">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center: DEMO/REAL switcher */}
      <div className="flex items-center gap-1 bg-[#1e2130] rounded-lg p-1">
        <button
          onClick={() => switchAccount('DEMO')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeType === 'DEMO'
              ? 'bg-amber-500/20 text-amber-400 shadow'
              : 'text-[#8b8fa8] hover:text-white'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          DEMO
        </button>
        <button
          onClick={() => switchAccount('REAL')}
          disabled={!realAccount}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeType === 'REAL'
              ? 'bg-[#2196F3]/20 text-[#2196F3] shadow'
              : 'text-[#8b8fa8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          REAL
        </button>
      </div>

      {/* Account balance display */}
      {activeAccount && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1e2130] rounded-lg">
          {activeType === 'DEMO' && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">DEMO</span>
          )}
          <span className="text-xs text-[#8b8fa8]">Balance:</span>
          <span className="text-sm font-bold text-white font-mono">
            ${(activeAccount.cash_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Link to={createPageUrl('Portal_Messages')} className="relative p-2 rounded-lg hover:bg-[#1e2130] text-[#8b8fa8] hover:text-white transition-colors">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1e2130] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2196F3] to-[#9C27B0] flex items-center justify-center text-xs font-bold text-white">
                {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-white leading-none">{user?.full_name || 'User'}</div>
                <div className="text-[10px] text-[#8b8fa8] leading-none mt-0.5">{user?.email}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-[#8b8fa8] hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1e2130] border-[#2a2e3f] w-48">
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('Portal_Settings')} className="flex items-center gap-2 text-[#d1d4dc] text-sm">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to={createPageUrl('Admin')} className="flex items-center gap-2 text-[#d1d4dc] text-sm">
                  <User className="h-4 w-4" /> Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#2a2e3f]" />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-sm cursor-pointer">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}