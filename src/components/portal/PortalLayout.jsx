import React, { useState, useEffect } from 'react';
import { AccountProvider, useAccount } from './AccountContext';
import PortalSidebar from './PortalSidebar';
import PortalHeader from './PortalHeader';
import AccountSetupModal from './AccountSetupModal';
import { base44 } from '@/api/base44Client';

function PortalShell({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userLoading, demoAccount, accountsLoading } = useAccount();
  const [showSetup, setShowSetup] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        base44.auth.redirectToLogin(window.location.pathname + window.location.search);
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (authChecked && !accountsLoading && user && !demoAccount) {
      setShowSetup(true);
    }
  }, [authChecked, accountsLoading, user, demoAccount]);

  if (userLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2196F3] border-t-transparent animate-spin" />
          <span className="text-[#8b8fa8] text-sm">Loading portal…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] flex overflow-hidden" style={{ height: '100vh' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-50">
            <PortalSidebar currentPage={currentPageName} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <PortalSidebar currentPage={currentPageName} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {showSetup && <AccountSetupModal onDone={() => setShowSetup(false)} />}
    </div>
  );
}

export default function PortalLayout({ children, currentPageName }) {
  return (
    <AccountProvider>
      <PortalShell currentPageName={currentPageName}>
        {children}
      </PortalShell>
    </AccountProvider>
  );
}