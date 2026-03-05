import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  BarChart3, Compass, Briefcase, History, Settings, Shield,
  Menu, X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { label: 'Chart', page: 'Chart', icon: BarChart3 },
  { label: 'Explore', page: 'Explore', icon: Compass },
  { label: 'Portfolio', page: 'Portfolio', icon: Briefcase },
  { label: 'Trades', page: 'Trades', icon: History },
  { label: 'Settings', page: 'Settings', icon: Settings },
  { label: 'Admin', page: 'Admin', icon: Shield },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Full screen mode for chart page
  if (currentPageName === 'Chart') {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#131722]">
      {/* Top nav */}
      <nav className="bg-[#1e222d] border-b border-[#2a2e39] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-6">
              <Link to={createPageUrl('Chart')} className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#2196F3]" />
                <span className="text-sm font-bold text-white tracking-tight">TV-Lite Paper</span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {NAV_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  return (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#2196F3]/10 text-[#2196F3]'
                          : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#787b86] hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2a2e39] px-4 py-2 bg-[#1e222d]">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    isActive ? 'bg-[#2196F3]/10 text-[#2196F3]' : 'text-[#787b86] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  <ChevronRight className="h-3 w-3 ml-auto" />
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {children}
    </div>
  );
}