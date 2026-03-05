import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, Target, Award } from 'lucide-react';
import priceEngine from '../components/trading/PriceEngine';

export default function SummaryPage() {
  const [prices, setPrices] = useState({});

  const { data: accounts } = useQuery({
    queryKey: ['accounts'], queryFn: () => base44.entities.Account.list(), initialData: [],
  });
  const { data: positions } = useQuery({
    queryKey: ['positions'], queryFn: () => base44.entities.Position.list(), initialData: [],
  });
  const { data: trades } = useQuery({
    queryKey: ['trades'], queryFn: () => base44.entities.Trade.list('-created_date', 500), initialData: [],
  });
  const { data: snapshots } = useQuery({
    queryKey: ['equity-snapshots'], queryFn: () => base44.entities.EquitySnapshot.list('-date', 90), initialData: [],
  });

  const account = accounts?.[0];
  const activePositions = (positions || []).filter(p => p.qty > 0);

  useEffect(() => {
    const unsubs = [];
    activePositions.forEach(pos => {
      const unsub = priceEngine.subscribe(pos.symbol, data => {
        setPrices(prev => ({ ...prev, [data.symbol]: data.price }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [activePositions.length]);

  const equity = (account?.current_cash || 0) + activePositions.reduce((sum, p) => {
    const last = prices[p.symbol] || p.avg_price;
    return sum + (last * p.qty);
  }, 0);

  const startingCash = account?.starting_cash || 100000;
  const totalReturn = ((equity - startingCash) / startingCash) * 100;
  const totalRealized = trades.reduce((sum, t) => sum + (t.realized_pnl || 0), 0);
  const sellTrades = trades.filter(t => t.side === 'sell' && t.realized_pnl !== undefined);
  const winTrades = sellTrades.filter(t => (t.realized_pnl || 0) > 0);
  const winRate = sellTrades.length > 0 ? (winTrades.length / sellTrades.length * 100) : 0;

  // Build equity curve from trades
  const equityCurve = React.useMemo(() => {
    const sortedTrades = [...trades].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    let cash = startingCash;
    const points = [{ date: 'Start', equity: startingCash }];
    sortedTrades.forEach((t, i) => {
      if (t.side === 'buy') {
        cash -= (t.total || 0);
      } else {
        cash += (t.total || 0);
      }
      points.push({
        date: new Date(t.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        equity: Math.round(cash * 100) / 100,
      });
    });
    // Add current equity
    points.push({ date: 'Now', equity: Math.round(equity * 100) / 100 });
    return points;
  }, [trades, equity, startingCash]);

  // Best/worst trades
  const bestTrade = sellTrades.length > 0 ? sellTrades.reduce((best, t) => (t.realized_pnl || 0) > (best.realized_pnl || 0) ? t : best, sellTrades[0]) : null;
  const worstTrade = sellTrades.length > 0 ? sellTrades.reduce((worst, t) => (t.realized_pnl || 0) < (worst.realized_pnl || 0) ? t : worst, sellTrades[0]) : null;

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Performance Summary</h1>

        {/* Key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10"><TrendingUp className="h-5 w-5 text-blue-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Total Return</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${totalReturn >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10"><BarChart3 className="h-5 w-5 text-green-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Realized P&L</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${totalRealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {totalRealized >= 0 ? '+' : ''}${totalRealized.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10"><Target className="h-5 w-5 text-purple-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Win Rate</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{winRate.toFixed(1)}%</div>
              <div className="text-xs text-[#787b86] mt-1">
                {winTrades.length}W / {sellTrades.length - winTrades.length}L of {sellTrades.length} trades
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-500/10"><Award className="h-5 w-5 text-orange-400" /></div>
                <span className="text-xs text-[#787b86] uppercase font-medium">Total Trades</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{trades.length}</div>
              <div className="text-xs text-[#787b86] mt-1">
                {trades.filter(t => t.side === 'buy').length} buys / {trades.filter(t => t.side === 'sell').length} sells
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equity curve */}
        <Card className="bg-[#1e222d] border-[#2a2e39] mb-8">
          <CardHeader className="border-b border-[#2a2e39]">
            <CardTitle className="text-lg text-white">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {equityCurve.length > 2 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={equityCurve}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#787b86' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#787b86' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e222d', border: '1px solid #2a2e39', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#d1d4dc' }}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#2196F3" fill="url(#equityGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#787b86] text-sm">
                Start trading to see your equity curve
              </div>
            )}
          </CardContent>
        </Card>

        {/* Best/worst */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="text-xs text-[#787b86] uppercase font-medium mb-3">Best Trade</div>
              {bestTrade ? (
                <div>
                  <div className="font-bold text-white">{bestTrade.symbol}</div>
                  <div className="text-[#26a69a] font-mono font-semibold text-lg">
                    +${(bestTrade.realized_pnl || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-[#787b86] mt-1">
                    {bestTrade.qty} shares @ ${bestTrade.price?.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-[#787b86] text-sm">No closed trades yet</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1e222d] border-[#2a2e39]">
            <CardContent className="p-5">
              <div className="text-xs text-[#787b86] uppercase font-medium mb-3">Worst Trade</div>
              {worstTrade ? (
                <div>
                  <div className="font-bold text-white">{worstTrade.symbol}</div>
                  <div className="text-[#ef5350] font-mono font-semibold text-lg">
                    ${(worstTrade.realized_pnl || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-[#787b86] mt-1">
                    {worstTrade.qty} shares @ ${worstTrade.price?.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-[#787b86] text-sm">No closed trades yet</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}