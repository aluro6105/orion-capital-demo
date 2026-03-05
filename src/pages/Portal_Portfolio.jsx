import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import priceEngine from '../components/trading/PriceEngine';

const COLORS = ['#2196F3', '#26a69a', '#9C27B0', '#FF9800', '#ef5350', '#00BCD4'];

function PortfolioContent() {
  const { activeAccount } = useAccount();
  const [prices, setPrices] = useState({});

  const { data: positions = [] } = useQuery({
    queryKey: ['broker-positions', activeAccount?.id],
    queryFn: () => base44.entities.BrokerPosition.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const activePos = positions.filter(p => p.qty > 0);

  useEffect(() => {
    const unsubs = [];
    activePos.forEach(p => {
      const unsub = priceEngine.subscribe(p.symbol, d => setPrices(prev => ({ ...prev, [d.symbol]: d.price })));
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [activePos.length]);

  const cash = activeAccount?.cash_balance || 0;
  const totalMarketValue = activePos.reduce((s, p) => s + ((prices[p.symbol] || p.avg_price) * p.qty), 0);
  const equity = cash + totalMarketValue;

  const pieData = [
    { name: 'Cash', value: cash, pct: equity > 0 ? (cash / equity * 100) : 0 },
    ...activePos.map(p => {
      const val = (prices[p.symbol] || p.avg_price) * p.qty;
      return { name: p.symbol, value: val, pct: equity > 0 ? (val / equity * 100) : 0 };
    }),
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Portfolio</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation pie */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Allocation</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2130', border: '1px solid #2a2e3f', borderRadius: 8, fontSize: 11 }}
                    formatter={(val, name) => [`$${val.toFixed(2)}`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[#d1d4dc]">{item.name}</span>
                    </div>
                    <span className="text-[#8b8fa8] font-mono">{item.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-[#8b8fa8] text-xs">No positions yet</div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Equity', value: `$${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-white' },
              { label: 'Cash', value: `$${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-green-400' },
              { label: 'Market Value', value: `$${totalMarketValue.toFixed(2)}`, color: 'text-[#2196F3]' },
            ].map(s => (
              <div key={s.label} className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4">
                <div className="text-xs text-[#8b8fa8] uppercase mb-1">{s.label}</div>
                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Positions table */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2130] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Open Positions</h2>
          <span className="text-xs text-[#8b8fa8]">{activePos.length} position{activePos.length !== 1 ? 's' : ''}</span>
        </div>
        {activePos.length === 0 ? (
          <div className="p-12 text-center text-[#8b8fa8]">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No open positions</p>
            <Link to={createPageUrl('Portal_Charts')} className="text-[#2196F3] text-xs hover:underline mt-1 inline-block">Start trading →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#8b8fa8] text-xs uppercase border-b border-[#1e2130]">
                  <th className="text-left p-3">Symbol</th>
                  <th className="text-right p-3">Qty</th>
                  <th className="text-right p-3">Avg Price</th>
                  <th className="text-right p-3">Last</th>
                  <th className="text-right p-3">Market Value</th>
                  <th className="text-right p-3">P&L</th>
                  <th className="text-right p-3">% Chg</th>
                </tr>
              </thead>
              <tbody>
                {activePos.map(p => {
                  const last = prices[p.symbol] || p.avg_price;
                  const pnl = (last - p.avg_price) * p.qty;
                  const pct = p.avg_price > 0 ? ((last - p.avg_price) / p.avg_price * 100) : 0;
                  const isUp = pnl >= 0;
                  return (
                    <tr key={p.id} className="border-t border-[#0a0d14] hover:bg-[#1e2130]/40">
                      <td className="p-3">
                        <Link to={createPageUrl('Portal_Charts') + `?symbol=${p.symbol}`} className="font-semibold text-white hover:text-[#2196F3]">{p.symbol}</Link>
                        <div className="text-[10px] text-[#8b8fa8]">{p.instrument_name}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-[#d1d4dc]">{p.qty}</td>
                      <td className="p-3 text-right font-mono text-[#d1d4dc]">${p.avg_price?.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-[#d1d4dc]">${last.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-white font-semibold">${(last * p.qty).toFixed(2)}</td>
                      <td className={`p-3 text-right font-mono font-semibold ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? '+' : ''}${pnl.toFixed(2)}
                      </td>
                      <td className={`p-3 text-right font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? '+' : ''}{pct.toFixed(2)}%
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
  );
}

export default function PortalPortfolioPage() {
  return <PortalLayout currentPageName="Portal_Portfolio"><PortfolioContent /></PortalLayout>;
}