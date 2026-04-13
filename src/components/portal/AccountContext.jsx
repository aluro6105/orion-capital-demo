import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [activeType, setActiveType] = useState(() => {
    return localStorage.getItem('portal_account_type') || 'DEMO';
  });
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem('nexus_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setUserLoading(false);
  }, []);

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['broker-accounts', user?.id],
    queryFn: () => base44.entities.BrokerAccount.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  const demoAccount = accounts.find(a => a.type === 'DEMO');
  const realAccount = accounts.find(a => a.type === 'REAL');
  const activeAccount = activeType === 'DEMO' ? demoAccount : realAccount;

  const switchAccount = (type) => {
    setActiveType(type);
    localStorage.setItem('portal_account_type', type);
  };

  const createDemoAccount = async () => {
    if (!user || demoAccount) return;
    const acc = await base44.entities.BrokerAccount.create({
      user_id: user.id,
      user_email: user.email,
      type: 'DEMO',
      cash_balance: 10000,
      starting_cash: 10000,
      display_name: `${user.full_name || user.email.split('@')[0]} — DEMO`,
      status: 'active',
    });
    queryClient.invalidateQueries({ queryKey: ['broker-accounts'] });
    return acc;
  };

  const createRealAccount = async () => {
    if (!user || realAccount) return;
    const acc = await base44.entities.BrokerAccount.create({
      user_id: user.id,
      user_email: user.email,
      type: 'REAL',
      cash_balance: 0,
      starting_cash: 0,
      display_name: `${user.full_name || user.email.split('@')[0]} — REAL`,
      status: 'pending',
    });
    queryClient.invalidateQueries({ queryKey: ['broker-accounts'] });
    return acc;
  };

  return (
    <AccountContext.Provider value={{
      user, userLoading,
      accounts, accountsLoading,
      demoAccount, realAccount, activeAccount, activeType,
      switchAccount, createDemoAccount, createRealAccount,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
}