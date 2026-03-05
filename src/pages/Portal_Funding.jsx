import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, AlertTriangle, CreditCard, Building } from 'lucide-react';
import { toast } from 'sonner';

const METHODS = ['bank_transfer', 'credit_card', 'debit_card', 'wire_transfer'];

function FundingContent() {
  const { activeAccount, activeType } = useAccount();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('tab') || 'deposit';
  });
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: kyc } = useQuery({
    queryKey: ['kyc-profile', activeAccount?.id],
    queryFn: () => base44.entities.KycProfile.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
    select: d => d?.[0],
  });

  const { data: ledger = [] } = useQuery({
    queryKey: ['ledger', activeAccount?.id],
    queryFn: () => base44.entities.LedgerEntry.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  if (activeType !== 'REAL') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Demo Account</h2>
          <p className="text-sm text-[#8b8fa8]">Funding is only available for Real accounts. Switch to REAL account in the header to access deposits and withdrawals.</p>
        </div>
      </div>
    );
  }

  const kycApproved = kyc?.status === 'approved';
  const sorted = [...ledger].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const handleSubmit = async (type) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (type === 'withdrawal' && !kycApproved) { toast.error('KYC verification required for withdrawals'); return; }
    if (type === 'withdrawal' && amt > (activeAccount?.cash_balance || 0)) { toast.error('Insufficient balance'); return; }

    setSubmitting(true);
    await base44.entities.LedgerEntry.create({
      account_id: activeAccount.id,
      user_id: activeAccount.user_id,
      type: type === 'deposit' ? 'deposit' : 'withdrawal',
      amount: amt,
      currency: 'USD',
      status: 'pending',
      method,
      notes,
      reference: `REF-${Date.now()}`,
    });

    // Create notification
    await base44.entities.Notification.create({
      user_id: activeAccount.user_id,
      type: 'funding',
      title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Request Submitted`,
      message: `Your ${type} request for $${amt.toFixed(2)} via ${method.replace('_', ' ')} is under review.`,
      read: false,
    });

    queryClient.invalidateQueries({ queryKey: ['ledger', activeAccount.id] });
    setAmount(''); setNotes('');
    toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request submitted. Under review.`);
    setSubmitting(false);
  };

  const statusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="h-3.5 w-3.5 text-[#26a69a]" />;
    if (status === 'rejected') return <XCircle className="h-3.5 w-3.5 text-[#ef5350]" />;
    return <Clock className="h-3.5 w-3.5 text-yellow-400" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Funding</h1>

      {/* KYC warning */}
      {!kycApproved && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-yellow-400">Verification Required for Withdrawals</strong>
            <p className="text-[#8b8fa8] mt-0.5">Complete KYC verification to enable withdrawals. Deposits are available immediately.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="border-b border-[#1e2130]">
              <TabsList className="bg-transparent border-0 h-12 px-4 gap-2">
                <TabsTrigger value="deposit" className="text-xs font-semibold data-[state=active]:bg-[#26a69a]/20 data-[state=active]:text-[#26a69a] text-[#8b8fa8] rounded-lg">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" /> Deposit
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="text-xs font-semibold data-[state=active]:bg-[#ef5350]/20 data-[state=active]:text-[#ef5350] text-[#8b8fa8] rounded-lg">
                  <ArrowDownRight className="h-3.5 w-3.5 mr-1.5" /> Withdraw
                </TabsTrigger>
              </TabsList>
            </div>

            {['deposit', 'withdraw'].map(type => (
              <TabsContent key={type} value={type} className="m-0 p-5 space-y-4">
                <div>
                  <Label className="text-xs text-[#8b8fa8] uppercase">Amount (USD)</Label>
                  <Input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" className="mt-1.5 bg-[#131722] border-[#1e2130] text-white font-mono text-lg h-12" />
                </div>
                <div>
                  <Label className="text-xs text-[#8b8fa8] uppercase">Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="mt-1.5 bg-[#131722] border-[#1e2130] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                      {METHODS.map(m => (
                        <SelectItem key={m} value={m} className="text-[#d1d4dc] text-xs capitalize">
                          {m.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-[#8b8fa8] uppercase">Reference / Notes</Label>
                  <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional reference..."
                    className="mt-1.5 bg-[#131722] border-[#1e2130] text-white text-xs" />
                </div>
                {type === 'withdraw' && !kycApproved && (
                  <div className="text-xs text-[#ef5350] bg-[#ef5350]/10 rounded-lg p-3">
                    ⚠ Complete KYC verification before withdrawing funds.
                  </div>
                )}
                <Button onClick={() => handleSubmit(type)} disabled={submitting || (type === 'withdraw' && !kycApproved)}
                  className={`w-full font-semibold ${type === 'deposit' ? 'bg-[#26a69a] hover:bg-[#26a69a]/90' : 'bg-[#ef5350] hover:bg-[#ef5350]/90'}`}>
                  {submitting ? 'Submitting…' : `Submit ${type.charAt(0).toUpperCase() + type.slice(1)} Request`}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Account summary */}
        <div className="space-y-3">
          <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
            <h3 className="text-xs text-[#8b8fa8] uppercase mb-3">Account Balance</h3>
            <div className="text-3xl font-bold font-mono text-white mb-1">
              ${(activeAccount?.cash_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-[#8b8fa8]">Available cash — USD</div>
          </div>
          <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4 text-xs text-[#8b8fa8] space-y-1">
            <div className="flex justify-between"><span>Total Deposited:</span><span className="text-white font-mono">${ledger.filter(l => l.type === 'deposit' && l.status === 'completed').reduce((s, l) => s + l.amount, 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Total Withdrawn:</span><span className="text-white font-mono">${ledger.filter(l => l.type === 'withdrawal' && l.status === 'completed').reduce((s, l) => s + l.amount, 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Pending:</span><span className="text-yellow-400 font-mono">{ledger.filter(l => l.status === 'pending').length} request(s)</span></div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2130]">
          <h2 className="text-sm font-semibold text-white">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#8b8fa8] text-xs uppercase border-b border-[#1e2130]">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Method</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-left p-3">Reference</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(l => (
                <tr key={l.id} className="border-t border-[#0a0d14] hover:bg-[#1e2130]/40">
                  <td className="p-3 text-[#8b8fa8] text-xs font-mono">{new Date(l.created_date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${l.type === 'deposit' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                      {l.type === 'deposit' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {l.type.charAt(0).toUpperCase() + l.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-[#8b8fa8] text-xs capitalize">{l.method?.replace(/_/g, ' ')}</td>
                  <td className="p-3 text-right font-mono text-white font-semibold">${l.amount?.toFixed(2)}</td>
                  <td className="p-3 text-[#8b8fa8] text-xs font-mono">{l.reference}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1 text-xs">
                      {statusIcon(l.status)}
                      <span className={l.status === 'completed' ? 'text-[#26a69a]' : l.status === 'rejected' ? 'text-[#ef5350]' : 'text-yellow-400'}>
                        {l.status?.charAt(0).toUpperCase() + l.status?.slice(1)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-[#8b8fa8] text-sm">No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PortalFundingPage() {
  return <PortalLayout currentPageName="Portal_Funding"><FundingContent /></PortalLayout>;
}