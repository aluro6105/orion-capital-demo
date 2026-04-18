import React, { createContext, useState, useContext, useEffect } from 'react';
import { createPageUrl } from '@/utils';
import { safeGet, safeRemove } from '@/lib/safeStorage';

const NexusAuthContext = createContext();

export const NexusAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = safeGet('nexus_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const logout = () => {
    safeRemove('nexus_user');
    setUser(null);
    window.location.href = createPageUrl('Login');
  };

  const requireAuth = () => {
    if (!loading && !user) {
      window.location.href = createPageUrl('Login');
      return false;
    }
    return true;
  };

  return (
    <NexusAuthContext.Provider value={{ user, loading, logout, requireAuth, setUser }}>
      {children}
    </NexusAuthContext.Provider>
  );
};

export const useNexusAuth = () => {
  const ctx = useContext(NexusAuthContext);
  if (!ctx) throw new Error('useNexusAuth must be used inside NexusAuthProvider');
  return ctx;
};