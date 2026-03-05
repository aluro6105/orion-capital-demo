import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: accounts } = useQuery({
    queryKey: ['accounts'], queryFn: () => base44.entities.Account.list(), initialData: [],
  });
  const account = accounts?.[0];

  const [form, setForm] = useState({
    timezone: 'America/New_York',
    country: 'US',
    base_currency: 'USD',
  });

  useEffect(() => {
    if (account) {
      setForm({
        timezone: account.timezone || 'America/New_York',
        country: account.country || 'US',
        base_currency: account.base_currency || 'USD',
      });
    }
  }, [account]);

  const handleSave = async () => {
    if (!account) return;
    setSaving(true);
    await base44.entities.Account.update(account.id, form);
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    toast.success('Settings saved');
    setSaving(false);
  };

  const handleResetAccount = async () => {
    if (!account) return;
    if (!confirm('This will reset your cash to $100,000 and delete all positions and trades. Continue?')) return;
    setSaving(true);

    // Delete all positions and trades
    const positions = await base44.entities.Position.list();
    for (const p of positions) await base44.entities.Position.delete(p.id);
    const trades = await base44.entities.Trade.list('-created_date', 1000);
    for (const t of trades) await base44.entities.Trade.delete(t.id);

    await base44.entities.Account.update(account.id, { current_cash: 100000, starting_cash: 100000 });
    queryClient.invalidateQueries();
    toast.success('Account reset to $100,000');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card className="bg-[#1e222d] border-[#2a2e39] mb-6">
          <CardHeader className="border-b border-[#2a2e39]">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-[#2196F3]" /> Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Timezone</Label>
              <Select value={form.timezone} onValueChange={v => setForm(p => ({ ...p, timezone: v }))}>
                <SelectTrigger className="mt-1 bg-[#131722] border-[#2a2e39] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e222d] border-[#2a2e39]">
                  <SelectItem value="America/New_York" className="text-[#d1d4dc]">Eastern (ET)</SelectItem>
                  <SelectItem value="America/Chicago" className="text-[#d1d4dc]">Central (CT)</SelectItem>
                  <SelectItem value="America/Los_Angeles" className="text-[#d1d4dc]">Pacific (PT)</SelectItem>
                  <SelectItem value="Europe/London" className="text-[#d1d4dc]">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Madrid" className="text-[#d1d4dc]">Madrid (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo" className="text-[#d1d4dc]">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Country</Label>
              <Input
                value={form.country}
                onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                className="mt-1 bg-[#131722] border-[#2a2e39] text-white"
              />
            </div>
            <div>
              <Label className="text-xs text-[#787b86] uppercase">Base Currency</Label>
              <Select value={form.base_currency} onValueChange={v => setForm(p => ({ ...p, base_currency: v }))}>
                <SelectTrigger className="mt-1 bg-[#131722] border-[#2a2e39] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e222d] border-[#2a2e39]">
                  <SelectItem value="USD" className="text-[#d1d4dc]">USD</SelectItem>
                  <SelectItem value="EUR" className="text-[#d1d4dc]">EUR</SelectItem>
                  <SelectItem value="GBP" className="text-[#d1d4dc]">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} disabled={saving} className="bg-[#2196F3] hover:bg-[#2196F3]/90">
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account info */}
        <Card className="bg-[#1e222d] border-[#2a2e39] mb-6">
          <CardHeader className="border-b border-[#2a2e39]">
            <CardTitle className="text-lg text-white">Paper Trading Account</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-[#787b86] text-xs uppercase">Starting Cash</span>
                <div className="text-white font-mono font-semibold mt-1">
                  ${(account?.starting_cash || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[#787b86] text-xs uppercase">Current Cash</span>
                <div className="text-white font-mono font-semibold mt-1">
                  ${(account?.current_cash || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <Button onClick={handleResetAccount} disabled={saving} variant="outline"
              className="border-[#ef5350] text-[#ef5350] hover:bg-[#ef5350]/10">
              <RefreshCw className="h-4 w-4 mr-2" /> Reset Account
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#787b86]">
              <strong className="text-yellow-500">Disclaimer:</strong> TV-Lite Paper es una herramienta de simulación
              educativa. No ejecuta operaciones reales ni proporciona asesoría financiera. Los precios mostrados son
              simulados y no representan cotizaciones de mercado en tiempo real.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}