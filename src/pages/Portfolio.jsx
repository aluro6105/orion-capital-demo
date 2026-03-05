import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Wallet, TrendingUp, TrendingDown, PieChart, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import priceEngine from '../components/trading/PriceEngine';

export default function PortfolioPage() {
  const [prices, setPrices] = useState({});

  const { data: accounts } = useQuery({
    queryKey: ['accounts'], queryFn: () => base44.entities.Account.list(), initialData: [],
  });
  const { data: positions } = useQuery({
    queryKey: ['positions'], queryFn: () => base44.entities.Position.list(), initialData: [],
  });
  const { data: trades } = useQuery({
    queryKey: ['trades'], queryFn: () => base44.entities.Trade.list('-created_date', 100), initialData: [],
  });

  const account = accounts?.[0];
  const activePositions = (positions || []).filter(p => p.qty > 0);

  useEffect(() => {
    const unsubs = [];
    activePositions.forEach(pos => {
      const unsub = priceEngine.subscribe(pos.symbol, (data) => {
        setPrices(prev => ({ ...prev, [data.symbol]: data.price }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [activePositions.length]);

  const totalMarketValue = activePositions.reduce((sum, p) => {
    const price = prices[p.symbol] || p.avg_price;
    return sum + (price * p.qty);
  }, 0);

  const totalUnrealized = activePositions.reduce((sum, p) => {
    const price = prices[p.symbol] || p.avg_price;
    return sum + ((price - p.avg_price) * p.qty);
  }, 0);

  const totalRealized = trades.reduce((sum, t) => sum + (t.realized_pnl || 0), 0);
  const equity = (account?.current_cash || 0) + totalMarketValue;
  const startingCash = account?.starting_cash || 100000;
  const totalReturn = ((equity - startingCash) / startingCash) * 100;

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10"><DollarSign className="h-5 w-5 text-blue-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Total Equity</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-mono mt-1 ${totalReturn >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}% all time
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10"><Wallet className="h-5 w-5 text-green-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Cash</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                ${(account?.current_cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-[#787b86] mt-1">
                {equity > 0 ? ((account?.current_cash || 0) / equity * 100).toFixed(1) : 0}% of portfolio
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10"><BarChart3 className="h-5 w-5 text-purple-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Unrealized P&L</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${totalUnrealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {totalUnrealized >= 0 ? '+' : ''}${totalUnrealized.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-500/10"><PieChart className="h-5 w-5 text-orange-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Realized P&L</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${totalRealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {totalRealized >= 0 ? '+' : ''}${totalRealized.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Positions */}
        <div className="bg-[#1e222d] rounded-xl border border-[#2a2e39] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a2e39]">
            <h2 className="text-lg font-semibold">Open Positions</h2>
          </div>
          {activePositions.length === 0 ? (
            <div className="p-12 text-center text-[#787b86]">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No open positions</p>
              <Link to={createPageUrl('Chart')} className="text-[#2196F3] text-sm hover:underline mt-2 inline-block">
                Start trading →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#787b86] text-xs uppercase border-b border-[#2a2e39]">
                    <th className="text-left p-3 font-medium">Symbol</th>
                    <th className="text-right p-3 font-medium">Qty</th>
                    <th className="text-right p-3 font-medium">Avg Price</th>
                    <th className="text-right p-3 font-medium">Last Price</th>
                    <th className="text-right p-3 font-medium">Market Value</th>
                    <th className="text-right p-3 font-medium">P&L</th>
                    <th className="text-right p-3 font-medium">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  {activePositions.map(p => {
                    const last = prices[p.symbol] || p.avg_price;
                    const pnl = (last - p.avg_price) * p.qty;
                    const pnlPct = p.avg_price > 0 ? ((last - p.avg_price) / p.avg_price * 100) : 0;
                    const isUp = pnl >= 0;
                    const marketValue = last * p.qty;
                    return (
                      <tr key={p.id} className="border-t border-[#131722] hover:bg-[#2a2e39]/30">
                        <td className="p-3">
                          <Link to={createPageUrl('Chart') + `?symbol=${p.symbol}`} className="font-semibold text-white hover:text-[#2196F3]">
                            {p.symbol}
                          </Link>
                        </td>
                        <td className="p-3 text-right font-mono text-[#d1d4dc]">{p.qty}</td>
                        <td className="p-3 text-right font-mono text-[#d1d4dc]">${p.avg_price?.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono text-[#d1d4dc]">${last?.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono text-white font-semibold">${marketValue.toFixed(2)}</td>
                        <td className={`p-3 text-right font-mono font-semibold ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                          {isUp ? '+' : ''}${pnl.toFixed(2)}
                        </td>
                        <td className={`p-3 text-right font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                          {isUp ? '+' : ''}{pnlPct.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}