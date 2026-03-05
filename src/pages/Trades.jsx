import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TradesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState('all');

  const { data: trades, isLoading } = useQuery({
    queryKey: ['all-trades'],
    queryFn: () => base44.entities.Trade.list('-created_date', 200),
    initialData: [],
  });

  const filtered = trades.filter(t => {
    const matchSearch = t.symbol?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSide = sideFilter === 'all' || t.side === sideFilter;
    return matchSearch && matchSide;
  });

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Date', 'Symbol', 'Side', 'Type', 'Qty', 'Price', 'Fee', 'Total', 'Realized P&L'];
    const rows = filtered.map(t => [
      new Date(t.created_date).toLocaleString(), t.symbol, t.side, t.order_type,
      t.qty, t.price?.toFixed(2), t.fee?.toFixed(2), t.total?.toFixed(2), t.realized_pnl?.toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'trades_history.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-3xl font-bold">Trade History</h1>
          <Button onClick={exportCSV} variant="outline" className="border-[#2a2e39] text-[#d1d4dc] hover:bg-[#2a2e39] text-xs">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#787b86]" />
            <Input
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by symbol..."
              className="pl-9 h-10 bg-[#1e222d] border-[#2a2e39] text-white placeholder:text-[#787b86]"
            />
          </div>
          <Select value={sideFilter} onValueChange={setSideFilter}>
            <SelectTrigger className="w-32 h-10 bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e222d] border-[#2a2e39]">
              <SelectItem value="all" className="text-[#d1d4dc]">All Sides</SelectItem>
              <SelectItem value="buy" className="text-[#26a69a]">Buy</SelectItem>
              <SelectItem value="sell" className="text-[#ef5350]">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#787b86] text-xs uppercase border-b border-[#2a2e39]">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Symbol</th>
                  <th className="text-left p-3 font-medium">Side</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-right p-3 font-medium">Qty</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-right p-3 font-medium">Realized P&L</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-t border-[#131722] hover:bg-[#2a2e39]/30">
                    <td className="p-3 text-[#d1d4dc] font-mono text-xs">
                      {new Date(t.created_date).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-white">{t.symbol}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        t.side === 'buy' ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#ef5350]/20 text-[#ef5350]'
                      }`}>{t.side?.toUpperCase()}</span>
                    </td>
                    <td className="p-3 text-[#787b86] text-xs uppercase">{t.order_type}</td>
                    <td className="p-3 text-right font-mono text-[#d1d4dc]">{t.qty}</td>
                    <td className="p-3 text-right font-mono text-[#d1d4dc]">${t.price?.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-white font-semibold">${t.total?.toFixed(2)}</td>
                    <td className={`p-3 text-right font-mono font-semibold ${
                      (t.realized_pnl || 0) >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'
                    }`}>
                      {t.realized_pnl ? `${t.realized_pnl >= 0 ? '+' : ''}$${t.realized_pnl.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-[#787b86]">
                    {isLoading ? 'Loading...' : 'No trades found'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 text-xs text-[#787b86] text-right">
          Showing {filtered.length} of {trades.length} trades
        </div>
      </div>
    </div>
  );
}