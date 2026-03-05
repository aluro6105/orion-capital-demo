import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Shield, FileText, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function SettingsContent() {
  const { user, activeAccount } = useAccount();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', timezone: 'America/New_York' });

  useEffect(() => {
    if (user) setForm(p => ({ ...p, full_name: user.full_name || '' }));
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    await base44.auth.updateMe({ full_name: form.full_name });
    toast.success('Profile updated');
    setSaving(false);
  };

  const handleLogout = () => base44.auth.logout('/');

  const LEGAL_DOCS = [
    { title: 'Terms of Service', content: 'These Terms of Service govern your use of the TradePortal platform. This is a paper trading simulation platform for educational purposes only. No real money is involved in Demo accounts. Real accounts require identity verification. By using this platform, you agree to these terms.' },
    { title: 'Privacy Policy', content: 'We collect and process your personal data to provide the TradePortal service. Your data is stored securely and never sold to third parties. You may request deletion of your data at any time by contacting support.' },
    { title: 'Risk Disclosure', content: 'Trading financial instruments involves significant risk. Past performance is not indicative of future results. This platform is for educational and simulation purposes only. Always seek professional financial advice before making real investment decisions.' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Profile */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2130]">
          <User className="h-4 w-4 text-[#2196F3]" />
          <h2 className="text-sm font-semibold text-white">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2196F3] to-[#9C27B0] flex items-center justify-center text-xl font-bold text-white">
              {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-white font-semibold">{user?.full_name || 'Unknown User'}</div>
              <div className="text-sm text-[#8b8fa8]">{user?.email}</div>
              <div className="text-xs text-[#8b8fa8] mt-0.5">Role: {user?.role}</div>
            </div>
          </div>
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">Display Name</Label>
            <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
              className="mt-1 bg-[#131722] border-[#1e2130] text-white" />
          </div>
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">Timezone</Label>
            <Select value={form.timezone} onValueChange={v => setForm(p => ({ ...p, timezone: v }))}>
              <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                {[
                  ['America/New_York', 'Eastern (ET)'],
                  ['America/Chicago', 'Central (CT)'],
                  ['America/Los_Angeles', 'Pacific (PT)'],
                  ['Europe/London', 'London (GMT)'],
                  ['Europe/Madrid', 'Madrid (CET)'],
                  ['Asia/Tokyo', 'Tokyo (JST)'],
                  ['Asia/Hong_Kong', 'Hong Kong (HKT)'],
                ].map(([v, l]) => <SelectItem key={v} value={v} className="text-[#d1d4dc] text-sm">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-[#2196F3] hover:bg-[#1976D2]">
            <Save className="h-3.5 w-3.5 mr-1.5" /> {saving ? 'Saving…' : 'Save Profile'}
          </Button>
        </div>
      </div>

      {/* Account info */}
      {activeAccount && (
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2130]">
            <Shield className="h-4 w-4 text-[#26a69a]" />
            <h2 className="text-sm font-semibold text-white">Active Account</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[#8b8fa8]">Name:</span> <span className="text-white">{activeAccount.display_name}</span></div>
            <div><span className="text-[#8b8fa8]">Type:</span> <span className="text-white font-semibold">{activeAccount.type}</span></div>
            <div><span className="text-[#8b8fa8]">Currency:</span> <span className="text-white">{activeAccount.base_currency}</span></div>
            <div><span className="text-[#8b8fa8]">Status:</span>
              <span className={`ml-1 font-semibold ${activeAccount.status === 'active' ? 'text-[#26a69a]' : 'text-yellow-400'}`}>
                {activeAccount.status?.charAt(0).toUpperCase() + activeAccount.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legal */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2130]">
          <FileText className="h-4 w-4 text-[#8b8fa8]" />
          <h2 className="text-sm font-semibold text-white">Legal Documents</h2>
        </div>
        <div className="divide-y divide-[#1e2130]">
          {LEGAL_DOCS.map(doc => (
            <details key={doc.title} className="group px-5 py-3">
              <summary className="text-sm text-[#d1d4dc] cursor-pointer hover:text-white list-none flex items-center justify-between">
                {doc.title}
                <span className="text-xs text-[#8b8fa8] group-open:hidden">View</span>
              </summary>
              <p className="text-xs text-[#8b8fa8] mt-3 leading-relaxed">{doc.content}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Sign Out</div>
          <div className="text-xs text-[#8b8fa8]">Log out from your account</div>
        </div>
        <Button onClick={handleLogout} variant="outline" className="border-[#ef5350]/50 text-[#ef5350] hover:bg-[#ef5350]/10 text-xs">
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
        </Button>
      </div>
    </div>
  );
}

export default function PortalSettingsPage() {
  return <PortalLayout currentPageName="Portal_Settings"><SettingsContent /></PortalLayout>;
}