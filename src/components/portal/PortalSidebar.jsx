import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard, BarChart3, Briefcase, History, Wallet,
  FileText, MessageSquare, HelpCircle, Settings, Shield,
  ChevronRight, X
} from 'lucide-react';
import { useAccount } from './AccountContext';

const NAV = [
  { label: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
  { label: 'Charts', page: 'Portal_Charts', icon: BarChart3 },
  { label: 'Portfolio', page: 'Portal_Portfolio', icon: Briefcase },
  { label: 'Orders & Trades', page: 'Portal_Trades', icon: History },
  { label: 'Funding', page: 'Portal_Funding', icon: Wallet, realOnly: true },
  { label: 'Verification', page: 'Portal_KYC', icon: Shield, realOnly: true },
  { label: 'Reports', page: 'Portal_Reports', icon: FileText },
  { label: 'Messages', page: 'Portal_Messages', icon: MessageSquare },
  { label: 'Support', page: 'Portal_Support', icon: HelpCircle },
  { label: 'Settings', page: 'Portal_Settings', icon: Settings },
  { label: 'Admin', page: 'Admin', icon: Settings, adminOnly: true },
];

export default function PortalSidebar({ currentPage, onClose }) {
  const { activeType } = useAccount();

  return (
    <div className="flex flex-col h-full bg-[#0f1117] border-r border-[#1e2130] w-56">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#1e2130]">
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2196F3] to-[#1565C0] flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">TradePortal</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-[#787b86] hover:text-white lg:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          if (item.realOnly && activeType !== 'REAL') return null;
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group ${
                isActive
                  ? 'bg-[#2196F3]/15 text-[#2196F3] font-medium'
                  : 'text-[#8b8fa8] hover:text-white hover:bg-[#1e2130]'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#1e2130]">
        <div className="text-[10px] text-[#4a4f6a] text-center">
          Paper Trading Simulator
        </div>
      </div>
    </div>
  );
}