import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search } from 'lucide-react';

function TradesContent() {
  const { activeAccount } = useAccount();
  const [search, setSearch] = useState('');
  const [side, setSide] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['broker-trades-all', activeAccount?.id],
    queryFn: () => base44.entities.BrokerTrade.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const sorted = [...trades].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  const filtered = sorted.filter(t => {
    const matchSym = t.symbol?.toLowerCase().includes(search.toLowerCase());
    const matchSide = side === 'all' || t.side === side;
    const date = new Date(t.created_date);
    const matchFrom = !dateFrom || date >= new Date(dateFrom);
    const matchTo = !dateTo || date <= new Date(dateTo + 'T23:59:59');
    return matchSym && matchSide && matchFrom && matchTo;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Symbol', 'Side', 'Type', 'Qty', 'Price', 'Fee', 'Total', 'Realized P&L'];
    const rows = filtered.map(t => [new Date(t.created_date).toLocaleString(), t.symbol, t.side, t.order_type, t.qty, t.price?.toFixed(2), t.fee?.toFixed(2), t.total?.toFixed(2), t.realized_pnl?.toFixed(2) || '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'trades.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const totalPnl = filtered.reduce((s, t) => s + (t.realized_pnl || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Orders & Trades</h1>
        <Button onClick={exportCSV} variant="outline" className="border-[#1e2130] text-[#d1d4dc] hover:bg-[#1e2130] text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8b8fa8]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Symbol..." className="pl-8 h-9 bg-[#0f1117] border-[#1e2130] text-white placeholder:text-[#8b8fa8] text-xs" />
        </div>
        <Select value={side} onValueChange={setSide}>
          <SelectTrigger className="w-28 h-9 bg-[#0f1117] border-[#1e2130] text-[#d1d4dc] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
            <SelectItem value="all" className="text-[#d1d4dc] text-xs">All Sides</SelectItem>
            <SelectItem value="buy" className="text-[#26a69a] text-xs">Buy</SelectItem>
            <SelectItem value="sell" className="text-[#ef5350] text-xs">Sell</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36 h-9 bg-[#0f1117] border-[#1e2130] text-[#d1d4dc] text-xs" />
        <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36 h-9 bg-[#0f1117] border-[#1e2130] text-[#d1d4dc] text-xs" />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-[#8b8fa8]">{filtered.length} trades</span>
        <span className={`font-mono font-semibold ${totalPnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
          Total P&L: {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#8b8fa8] text-xs uppercase border-b border-[#1e2130]">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Symbol</th>
                <th className="text-left p-3">Side</th>
                <th className="text-left p-3">Type</th>
                <th className="text-right p-3">Qty</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">Realized P&L</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-t border-[#0a0d14] hover:bg-[#1e2130]/40">
                  <td className="p-3 text-[#8b8fa8] font-mono text-xs">{new Date(t.created_date).toLocaleString()}</td>
                  <td className="p-3"><span className="font-semibold text-white">{t.symbol}</span></td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.side === 'buy' ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#ef5350]/20 text-[#ef5350]'}`}>{t.side?.toUpperCase()}</span></td>
                  <td className="p-3 text-[#8b8fa8] text-xs uppercase">{t.order_type}</td>
                  <td className="p-3 text-right font-mono text-[#d1d4dc]">{t.qty}</td>
                  <td className="p-3 text-right font-mono text-[#d1d4dc]">${t.price?.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono text-white font-semibold">${t.total?.toFixed(2)}</td>
                  <td className={`p-3 text-right font-mono font-semibold ${(t.realized_pnl || 0) >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                    {t.realized_pnl ? `${t.realized_pnl >= 0 ? '+' : ''}$${t.realized_pnl.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-[#8b8fa8] text-sm">{isLoading ? 'Loading…' : 'No trades found'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PortalTradesPage() {
  return <PortalLayout currentPageName="Portal_Trades"><TradesContent /></PortalLayout>;
}