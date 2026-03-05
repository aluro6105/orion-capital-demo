import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Bell, CheckCircle2, TrendingUp, Shield, Wallet, Wrench, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TYPE_CONFIG = {
  trade: { icon: TrendingUp, color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10' },
  kyc: { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  funding: { icon: Wallet, color: 'text-[#2196F3]', bg: 'bg-[#2196F3]/10' },
  system: { icon: Bell, color: 'text-[#8b8fa8]', bg: 'bg-[#8b8fa8]/10' },
  ticket: { icon: Wrench, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  alert: { icon: AlertTriangle, color: 'text-[#ef5350]', bg: 'bg-[#ef5350]/10' },
};

function MessagesContent() {
  const { user } = useAccount();
  const queryClient = useQueryClient();

  const { data: notifs = [] } = useQuery({
    queryKey: ['all-notifications', user?.id],
    queryFn: () => base44.entities.Notification.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  const sorted = [...notifs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  const unread = sorted.filter(n => !n.read);

  const markAllRead = async () => {
    for (const n of unread) await base44.entities.Notification.update(n.id, { read: true });
    queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    toast.success('All marked as read');
  };

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { read: true });
    queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unread.length > 0 && <p className="text-xs text-[#8b8fa8]">{unread.length} unread</p>}
        </div>
        {unread.length > 0 && (
          <Button onClick={markAllRead} variant="outline" size="sm" className="border-[#1e2130] text-[#d1d4dc] hover:bg-[#1e2130] text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark All Read
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-12 text-center">
          <Bell className="h-10 w-10 text-[#1e2130] mx-auto mb-3" />
          <p className="text-sm text-[#8b8fa8]">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  n.read ? 'bg-[#0f1117] border-[#1e2130] opacity-60' : 'bg-[#0f1117] border-[#1e2130] hover:border-[#2a2e3f]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold ${n.read ? 'text-[#8b8fa8]' : 'text-white'}`}>{n.title}</span>
                    <span className="text-[10px] text-[#8b8fa8] flex-shrink-0">{new Date(n.created_date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-[#8b8fa8] mt-0.5">{n.message}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#2196F3] flex-shrink-0 mt-1.5" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PortalMessagesPage() {
  return <PortalLayout currentPageName="Portal_Messages"><MessagesContent /></PortalLayout>;
}