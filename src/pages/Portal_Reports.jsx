import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

function ReportsContent() {
  const { activeAccount } = useAccount();
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);

  const { data: trades = [] } = useQuery({
    queryKey: ['broker-trades-all', activeAccount?.id],
    queryFn: () => base44.entities.BrokerTrade.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const { data: ledger = [] } = useQuery({
    queryKey: ['ledger', activeAccount?.id],
    queryFn: () => base44.entities.LedgerEntry.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const filteredTrades = trades.filter(t => {
    const d = new Date(t.created_date);
    return d >= new Date(dateFrom) && d <= new Date(dateTo + 'T23:59:59');
  });

  const filteredLedger = ledger.filter(l => {
    const d = new Date(l.created_date);
    return d >= new Date(dateFrom) && d <= new Date(dateTo + 'T23:59:59');
  });

  const totalPnl = filteredTrades.reduce((s, t) => s + (t.realized_pnl || 0), 0);
  const totalFees = filteredTrades.reduce((s, t) => s + (t.fee || 0), 0);
  const totalDeposits = filteredLedger.filter(l => l.type === 'deposit' && l.status === 'completed').reduce((s, l) => s + l.amount, 0);
  const totalWithdrawals = filteredLedger.filter(l => l.type === 'withdrawal' && l.status === 'completed').reduce((s, l) => s + l.amount, 0);

  const exportCSV = () => {
    const headers = ['Date', 'Symbol', 'Side', 'Qty', 'Price', 'Total', 'Fee', 'P&L'];
    const rows = filteredTrades.map(t => [new Date(t.created_date).toLocaleString(), t.symbol, t.side, t.qty, t.price?.toFixed(2), t.total?.toFixed(2), t.fee?.toFixed(2), t.realized_pnl?.toFixed(2) || '0']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `statement_${dateFrom}_${dateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Statement exported as CSV');
  };

  const generatePDF = async () => {
    setGenerating(true);
    const content = `
ACCOUNT STATEMENT
Account: ${activeAccount?.display_name}
Period: ${dateFrom} to ${dateTo}

SUMMARY
Total Trades: ${filteredTrades.length}
Realized P&L: ${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}
Total Fees: $${totalFees.toFixed(2)}
Deposits: $${totalDeposits.toFixed(2)}
Withdrawals: $${totalWithdrawals.toFixed(2)}

TRADE HISTORY
${filteredTrades.map(t => `${new Date(t.created_date).toLocaleDateString()} | ${t.symbol} | ${t.side.toUpperCase()} | ${t.qty} @ $${t.price?.toFixed(2)} | Total: $${t.total?.toFixed(2)} | P&L: $${(t.realized_pnl || 0).toFixed(2)}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `statement_${dateFrom}_${dateTo}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Statement downloaded');
    setGenerating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Reports & Statements</h1>

      {/* Date range selector */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="h-4 w-4" /> Select Period</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">From</Label>
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="mt-1 bg-[#131722] border-[#1e2130] text-white w-40" />
          </div>
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">To</Label>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="mt-1 bg-[#131722] border-[#1e2130] text-white w-40" />
          </div>
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline" className="border-[#1e2130] text-[#d1d4dc] hover:bg-[#1e2130] text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" /> CSV
            </Button>
            <Button onClick={generatePDF} disabled={generating} className="bg-[#2196F3] hover:bg-[#1976D2] text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" /> {generating ? 'Generating…' : 'Statement'}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Trades', value: filteredTrades.length, color: 'text-white' },
          { label: 'Realized P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]' },
          { label: 'Fees Paid', value: `$${totalFees.toFixed(2)}`, color: 'text-[#ef5350]' },
          { label: 'Net Funding', value: `$${(totalDeposits - totalWithdrawals).toFixed(2)}`, color: 'text-[#2196F3]' },
        ].map(s => (
          <div key={s.label} className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4">
            <div className="text-xs text-[#8b8fa8] uppercase mb-1">{s.label}</div>
            <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Trade list */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2130] flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#2196F3]" />
          <h2 className="text-sm font-semibold text-white">Trade History ({filteredTrades.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[#8b8fa8] uppercase border-b border-[#1e2130]">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Symbol</th>
                <th className="text-left p-3">Side</th>
                <th className="text-right p-3">Qty</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">P&L</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.slice(0, 50).map(t => (
                <tr key={t.id} className="border-t border-[#0a0d14] hover:bg-[#1e2130]/40">
                  <td className="p-3 text-[#8b8fa8] font-mono">{new Date(t.created_date).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-white">{t.symbol}</td>
                  <td className="p-3"><span className={`font-bold ${t.side === 'buy' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>{t.side?.toUpperCase()}</span></td>
                  <td className="p-3 text-right font-mono text-[#d1d4dc]">{t.qty}</td>
                  <td className="p-3 text-right font-mono text-[#d1d4dc]">${t.price?.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono text-white">${t.total?.toFixed(2)}</td>
                  <td className={`p-3 text-right font-mono font-semibold ${(t.realized_pnl || 0) >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                    {t.realized_pnl ? `${t.realized_pnl >= 0 ? '+' : ''}$${t.realized_pnl.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
              {filteredTrades.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-[#8b8fa8]">No trades in this period</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PortalReportsPage() {
  return <PortalLayout currentPageName="Portal_Reports"><ReportsContent /></PortalLayout>;
}