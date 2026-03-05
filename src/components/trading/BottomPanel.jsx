import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import priceEngine from './PriceEngine';

export default function BottomPanel({ positions, trades, account, equitySnapshots }) {
  const [tab, setTab] = useState('positions');
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    const unsubs = [];
    (positions || []).forEach(pos => {
      const unsub = priceEngine.subscribe(pos.symbol, (data) => {
        setLivePrices(prev => ({ ...prev, [data.symbol]: data.price }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [positions]);

  const exportCSV = () => {
    if (!trades || trades.length === 0) return;
    const headers = ['Date', 'Symbol', 'Side', 'Type', 'Qty', 'Price', 'Fee', 'Total', 'P&L'];
    const rows = trades.map(t => [
      new Date(t.created_date).toLocaleString(),
      t.symbol, t.side, t.order_type, t.qty,
      t.price?.toFixed(2), t.fee?.toFixed(2), t.total?.toFixed(2), t.realized_pnl?.toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'trades.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const totalUnrealized = (positions || []).reduce((sum, p) => {
    const last = livePrices[p.symbol] || p.avg_price;
    return sum + ((last - p.avg_price) * p.qty);
  }, 0);

  const equity = (account?.current_cash || 0) + (positions || []).reduce((sum, p) => {
    const last = livePrices[p.symbol] || p.avg_price;
    return sum + (last * p.qty);
  }, 0);

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] flex flex-col" style={{ minHeight: 180 }}>
      <Tabs value={tab} onValueChange={setTab} className="flex flex-col h-full">
        <div className="flex items-center justify-between px-3 border-b border-[#2a2e39]">
          <TabsList className="bg-transparent border-0 h-8 gap-0">
            <TabsTrigger value="positions" className="text-[10px] uppercase font-semibold px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2196F3] rounded-none text-[#787b86]">
              Positions
            </TabsTrigger>
            <TabsTrigger value="trades" className="text-[10px] uppercase font-semibold px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2196F3] rounded-none text-[#787b86]">
              Trades
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-[10px] uppercase font-semibold px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2196F3] rounded-none text-[#787b86]">
              Performance
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[#787b86]">Equity: <span className="text-white font-mono font-semibold">${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
            <span className={`font-mono ${totalUnrealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
              P&L: {totalUnrealized >= 0 ? '+' : ''}{totalUnrealized.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="positions" className="m-0 h-full">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-[#787b86] uppercase text-[10px]">
                  <th className="text-left p-2 font-medium">Symbol</th>
                  <th className="text-right p-2 font-medium">Qty</th>
                  <th className="text-right p-2 font-medium">Avg Price</th>
                  <th className="text-right p-2 font-medium">Last</th>
                  <th className="text-right p-2 font-medium">P&L</th>
                  <th className="text-right p-2 font-medium">% Change</th>
                </tr>
              </thead>
              <tbody>
                {(positions || []).filter(p => p.qty > 0).map(p => {
                  const last = livePrices[p.symbol] || p.avg_price;
                  const pnl = (last - p.avg_price) * p.qty;
                  const pnlPct = p.avg_price > 0 ? ((last - p.avg_price) / p.avg_price * 100) : 0;
                  const isUp = pnl >= 0;
                  return (
                    <tr key={p.id || p.symbol} className="border-t border-[#1e222d] hover:bg-[#1e222d]/50">
                      <td className="p-2 font-semibold text-white">{p.symbol}</td>
                      <td className="p-2 text-right text-[#d1d4dc] font-mono">{p.qty}</td>
                      <td className="p-2 text-right text-[#d1d4dc] font-mono">${p.avg_price?.toFixed(2)}</td>
                      <td className="p-2 text-right text-[#d1d4dc] font-mono">${last?.toFixed(2)}</td>
                      <td className={`p-2 text-right font-mono font-semibold ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? '+' : ''}{pnl.toFixed(2)}
                      </td>
                      <td className={`p-2 text-right font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? '+' : ''}{pnlPct.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
                {(!positions || positions.filter(p => p.qty > 0).length === 0) && (
                  <tr><td colSpan={6} className="p-4 text-center text-[#787b86]">No open positions</td></tr>
                )}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="trades" className="m-0 h-full">
            <div className="flex justify-end px-2 pt-1">
              <Button variant="ghost" size="sm" onClick={exportCSV} className="h-6 text-[10px] text-[#787b86] hover:text-white">
                <Download className="h-3 w-3 mr-1" /> Export CSV
              </Button>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-[#787b86] uppercase text-[10px]">
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-left p-2 font-medium">Symbol</th>
                  <th className="text-left p-2 font-medium">Side</th>
                  <th className="text-right p-2 font-medium">Qty</th>
                  <th className="text-right p-2 font-medium">Price</th>
                  <th className="text-right p-2 font-medium">Total</th>
                  <th className="text-right p-2 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {(trades || []).map(t => (
                  <tr key={t.id} className="border-t border-[#1e222d] hover:bg-[#1e222d]/50">
                    <td className="p-2 text-[#d1d4dc] font-mono">{new Date(t.created_date).toLocaleDateString()}</td>
                    <td className="p-2 font-semibold text-white">{t.symbol}</td>
                    <td className={`p-2 font-semibold ${t.side === 'buy' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                      {t.side?.toUpperCase()}
                    </td>
                    <td className="p-2 text-right text-[#d1d4dc] font-mono">{t.qty}</td>
                    <td className="p-2 text-right text-[#d1d4dc] font-mono">${t.price?.toFixed(2)}</td>
                    <td className="p-2 text-right text-[#d1d4dc] font-mono">${t.total?.toFixed(2)}</td>
                    <td className={`p-2 text-right font-mono ${(t.realized_pnl || 0) >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                      {t.realized_pnl ? `${t.realized_pnl >= 0 ? '+' : ''}${t.realized_pnl.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))}
                {(!trades || trades.length === 0) && (
                  <tr><td colSpan={7} className="p-4 text-center text-[#787b86]">No trades yet</td></tr>
                )}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="performance" className="m-0 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Equity</div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Cash</div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  ${(account?.current_cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Unrealized P&L</div>
                <div className={`text-lg font-bold font-mono mt-1 ${totalUnrealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                  {totalUnrealized >= 0 ? '+' : ''}{totalUnrealized.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Total Trades</div>
                <div className="text-lg font-bold text-white font-mono mt-1">{trades?.length || 0}</div>
              </div>
            </div>

            {/* Win rate */}
            {trades && trades.length > 0 && (
              <div className="mt-3 bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase mb-2">Trade Statistics</div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#787b86]">Wins: </span>
                    <span className="text-[#26a69a] font-mono">{trades.filter(t => (t.realized_pnl || 0) > 0).length}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86]">Losses: </span>
                    <span className="text-[#ef5350] font-mono">{trades.filter(t => (t.realized_pnl || 0) < 0).length}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86]">Win Rate: </span>
                    <span className="text-white font-mono">
                      {trades.filter(t => t.realized_pnl).length > 0
                        ? (trades.filter(t => (t.realized_pnl || 0) > 0).length / trades.filter(t => t.realized_pnl).length * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}