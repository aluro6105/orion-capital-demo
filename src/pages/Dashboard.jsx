import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight,
  ArrowDownRight, RefreshCw, Plus, Download, BarChart3, Link as LinkIcon,
  Clock, FlaskConical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import priceEngine from '../components/trading/PriceEngine';

function DashboardContent() {
  const { activeAccount, activeType, user } = useAccount();
  const queryClient = useQueryClient();
  const [prices, setPrices] = useState({});
  const [resetting, setResetting] = useState(false);

  const { data: positions = [] } = useQuery({
    queryKey: ['broker-positions', activeAccount?.id],
    queryFn: () => base44.entities.BrokerPosition.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const { data: recentTrades = [] } = useQuery({
    queryKey: ['broker-trades-recent', activeAccount?.id],
    queryFn: () => base44.entities.BrokerTrade.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const { data: kycProfile } = useQuery({
    queryKey: ['kyc-profile', activeAccount?.id],
    queryFn: () => base44.entities.KycProfile.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id && activeType === 'REAL',
    select: d => d?.[0],
  });

  const { data: ledger = [] } = useQuery({
    queryKey: ['ledger', activeAccount?.id],
    queryFn: () => base44.entities.LedgerEntry.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id && activeType === 'REAL',
  });

  const activePos = positions.filter(p => p.qty > 0);

  useEffect(() => {
    const unsubs = [];
    activePos.forEach(p => {
      const unsub = priceEngine.subscribe(p.symbol, d => {
        setPrices(prev => ({ ...prev, [d.symbol]: d.price }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [activePos.length]);

  const marketValue = activePos.reduce((s, p) => s + ((prices[p.symbol] || p.avg_price) * p.qty), 0);
  const unrealizedPnl = activePos.reduce((s, p) => s + (((prices[p.symbol] || p.avg_price) - p.avg_price) * p.qty), 0);
  const cash = activeAccount?.cash_balance || 0;
  const equity = cash + marketValue;
  const startingCash = activeAccount?.starting_cash || 100000;
  const returnPct = startingCash > 0 ? ((equity - startingCash) / startingCash * 100) : 0;
  const realizedTotal = recentTrades.reduce((s, t) => s + (t.realized_pnl || 0), 0);

  const handleResetDemo = async () => {
    if (!activeAccount || activeType !== 'DEMO') return;
    if (!confirm('Reset demo account to $100,000? All positions and trades will be cleared.')) return;
    setResetting(true);
    // Delete positions and trades
    for (const p of positions) await base44.entities.BrokerPosition.delete(p.id);
    for (const t of recentTrades) await base44.entities.BrokerTrade.delete(t.id);
    await base44.entities.BrokerAccount.update(activeAccount.id, { cash_balance: 100000, starting_cash: 100000 });
    queryClient.invalidateQueries();
    toast.success('Demo account reset to $100,000');
    setResetting(false);
  };

  const sortedTrades = [...recentTrades].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 10);

  const kycStatus = kycProfile?.status || 'not_started';
  const kycColors = {
    not_started: 'text-[#8b8fa8]',
    in_review: 'text-yellow-400',
    approved: 'text-[#26a69a]',
    action_required: 'text-[#ef5350]',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Account banner */}
      <div className={`rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 ${
        activeType === 'DEMO' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-[#2196F3]/10 border border-[#2196F3]/30'
      }`}>
        <div className="flex items-center gap-3">
          <FlaskConical className={`h-5 w-5 ${activeType === 'DEMO' ? 'text-amber-400' : 'text-[#2196F3]'}`} />
          <div>
            <div className="text-sm font-semibold text-white">{activeAccount?.display_name}</div>
            <div className="text-xs text-[#8b8fa8]">
              {activeType === 'DEMO' ? 'Paper trading — virtual funds only' : 'Live account — real funds'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeType === 'DEMO' && (
            <>
              <Button size="sm" variant="outline" onClick={handleResetDemo} disabled={resetting}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs h-8">
                <RefreshCw className="h-3 w-3 mr-1" /> Reset
              </Button>
              <Link to={createPageUrl('Portal_Trades')}>
                <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs h-8">
                  <Download className="h-3 w-3 mr-1" /> Export Trades
                </Button>
              </Link>
            </>
          )}
          {activeType === 'REAL' && (
            <>
              <Link to={createPageUrl('Portal_Funding')}>
                <Button size="sm" className="bg-[#2196F3] hover:bg-[#1976D2] text-xs h-8">
                  <Plus className="h-3 w-3 mr-1" /> Deposit
                </Button>
              </Link>
              <Link to={createPageUrl('Portal_KYC')}>
                <Button size="sm" variant="outline" className={`border-[#2196F3]/30 text-xs h-8 ${kycColors[kycStatus]}`}>
                  KYC: {kycStatus.replace('_', ' ').toUpperCase()}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8b8fa8] uppercase tracking-wide">Equity</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs font-mono mt-1 ${returnPct >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {returnPct >= 0 ? '▲' : '▼'} {Math.abs(returnPct).toFixed(2)}% total return
          </div>
        </div>

        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8b8fa8] uppercase tracking-wide">Cash</span>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#8b8fa8] mt-1">
            {equity > 0 ? (cash / equity * 100).toFixed(1) : 0}% of equity
          </div>
        </div>

        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8b8fa8] uppercase tracking-wide">Unrealized P&L</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${unrealizedPnl >= 0 ? 'bg-[#26a69a]/10' : 'bg-[#ef5350]/10'}`}>
              {unrealizedPnl >= 0 ? <TrendingUp className="h-4 w-4 text-[#26a69a]" /> : <TrendingDown className="h-4 w-4 text-[#ef5350]" />}
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono ${unrealizedPnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)}
          </div>
          <div className="text-xs text-[#8b8fa8] mt-1">{activePos.length} open position{activePos.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8b8fa8] uppercase tracking-wide">Realized P&L</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${realizedTotal >= 0 ? 'bg-[#26a69a]/10' : 'bg-[#ef5350]/10'}`}>
              <BarChart3 className={`h-4 w-4 ${realizedTotal >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono ${realizedTotal >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {realizedTotal >= 0 ? '+' : ''}${realizedTotal.toFixed(2)}
          </div>
          <div className="text-xs text-[#8b8fa8] mt-1">{recentTrades.length} total trades</div>
        </div>
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to={createPageUrl('Portal_Charts')}>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                <BarChart3 className="h-4 w-4 text-[#2196F3]" /> Open Charts
              </button>
            </Link>
            <Link to={createPageUrl('Portal_Portfolio')}>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                <TrendingUp className="h-4 w-4 text-green-400" /> View Portfolio
              </button>
            </Link>
            {activeType === 'REAL' && (
              <>
                <Link to={createPageUrl('Portal_Funding')}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                    <ArrowUpRight className="h-4 w-4 text-[#26a69a]" /> Deposit Funds
                  </button>
                </Link>
                <Link to={createPageUrl('Portal_Funding') + '?tab=withdraw'}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                    <ArrowDownRight className="h-4 w-4 text-[#ef5350]" /> Withdraw Funds
                  </button>
                </Link>
                <Link to={createPageUrl('Portal_KYC')}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                    <LinkIcon className="h-4 w-4 text-purple-400" /> KYC Verification
                  </button>
                </Link>
              </>
            )}
            {activeType === 'DEMO' && (
              <button onClick={handleResetDemo} disabled={resetting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                <RefreshCw className="h-4 w-4 text-amber-400" /> Reset Demo Account
              </button>
            )}
            <Link to={createPageUrl('Portal_Reports')}>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e2130] hover:bg-[#252836] transition-all text-left text-sm text-[#d1d4dc]">
                <Download className="h-4 w-4 text-[#8b8fa8]" /> Statements & Reports
              </button>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <Link to={createPageUrl('Portal_Trades')} className="text-xs text-[#2196F3] hover:underline">View all</Link>
          </div>
          <div className="space-y-1">
            {sortedTrades.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Clock className="h-8 w-8 text-[#1e2130] mb-2" />
                <p className="text-xs text-[#8b8fa8]">No activity yet. Start trading!</p>
              </div>
            ) : (
              sortedTrades.map(t => (
                <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#1e2130] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${t.side === 'buy' ? 'bg-[#26a69a]/20' : 'bg-[#ef5350]/20'}`}>
                      {t.side === 'buy' ? <ArrowUpRight className="h-3 w-3 text-[#26a69a]" /> : <ArrowDownRight className="h-3 w-3 text-[#ef5350]" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white">{t.symbol}</span>
                      <span className={`text-[10px] ml-1.5 font-bold ${t.side === 'buy' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {t.side.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-white">${t.total?.toFixed(2)}</div>
                    <div className="text-[10px] text-[#8b8fa8]">{new Date(t.created_date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PortalLayout currentPageName="Dashboard">
      <DashboardContent />
    </PortalLayout>
  );
}