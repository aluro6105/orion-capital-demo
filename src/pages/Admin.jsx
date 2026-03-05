import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Shield, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: adminSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => base44.entities.AdminSettings.list(),
    initialData: [],
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const settings = adminSettings?.[0];

  const [form, setForm] = useState({
    cash_default: 100000,
    fee_type: 'fixed',
    fee_value: 0,
    max_ws_symbols_per_user: 20,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        cash_default: settings.cash_default || 100000,
        fee_type: settings.fee_type || 'fixed',
        fee_value: settings.fee_value || 0,
        max_ws_symbols_per_user: settings.max_ws_symbols_per_user || 20,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    if (settings) {
      await base44.entities.AdminSettings.update(settings.id, form);
    } else {
      await base44.entities.AdminSettings.create(form);
    }
    queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    toast.success('Admin settings saved');
    setSaving(false);
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#131722] text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-[#787b86] mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-[#787b86] text-sm">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-7 w-7 text-[#2196F3]" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <Card className="bg-[#1e222d] border-[#2a2e39] mb-6">
          <CardHeader className="border-b border-[#2a2e39]">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" /> Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Default Starting Cash</Label>
              <Input
                type="number" value={form.cash_default}
                onChange={e => setForm(p => ({ ...p, cash_default: parseFloat(e.target.value) }))}
                className="mt-1 bg-[#131722] border-[#2a2e39] text-white font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Fee Type</Label>
              <Select value={form.fee_type} onValueChange={v => setForm(p => ({ ...p, fee_type: v }))}>
                <SelectTrigger className="mt-1 bg-[#131722] border-[#2a2e39] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e222d] border-[#2a2e39]">
                  <SelectItem value="fixed" className="text-[#d1d4dc]">Fixed ($)</SelectItem>
                  <SelectItem value="percentage" className="text-[#d1d4dc]">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Fee Value ({form.fee_type === 'fixed' ? '$' : '%'})</Label>
              <Input
                type="number" step="0.01" value={form.fee_value}
                onChange={e => setForm(p => ({ ...p, fee_value: parseFloat(e.target.value) }))}
                className="mt-1 bg-[#131722] border-[#2a2e39] text-white font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Max Symbols per User (Watchlist)</Label>
              <Input
                type="number" value={form.max_ws_symbols_per_user}
                onChange={e => setForm(p => ({ ...p, max_ws_symbols_per_user: parseInt(e.target.value) }))}
                className="mt-1 bg-[#131722] border-[#2a2e39] text-white font-mono"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-[#2196F3] hover:bg-[#2196F3]/90">
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1e222d] border-[#2a2e39]">
          <CardHeader className="border-b border-[#2a2e39]">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Users className="h-5 w-5" /> Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#787b86] text-xs uppercase border-b border-[#2a2e39]">
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t border-[#131722] hover:bg-[#2a2e39]/30">
                      <td className="p-3 text-white font-medium">{u.full_name || '—'}</td>
                      <td className="p-3 text-[#d1d4dc]">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-[#2196F3]/20 text-[#2196F3]' : 'bg-[#787b86]/20 text-[#787b86]'
                        }`}>{u.role}</span>
                      </td>
                      <td className="p-3 text-[#787b86] text-xs font-mono">
                        {u.created_date ? new Date(u.created_date).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}