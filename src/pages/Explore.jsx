import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Flame, BarChart3, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import priceEngine from '../components/trading/PriceEngine';

const ALL_INSTRUMENTS = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon.com', type: 'stock' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'etf' },
  { symbol: 'IWM', name: 'iShares Russell 2000', type: 'etf' },
  { symbol: 'BTCUSD', name: 'Bitcoin / USD', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum / USD', type: 'crypto' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'forex' },
  { symbol: 'GBPUSD', name: 'British Pound / USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Yen', type: 'forex' },
];

const CATEGORIES = ['all', 'stock', 'etf', 'crypto', 'forex'];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const unsubs = [];
    ALL_INSTRUMENTS.forEach(inst => {
      const unsub = priceEngine.subscribe(inst.symbol, (data) => {
        setPrices(prev => ({ ...prev, [data.symbol]: data }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, []);

  const filtered = ALL_INSTRUMENTS.filter(inst => {
    const matchSearch = inst.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = category === 'all' || inst.type === category;
    return matchSearch && matchCat;
  });

  const trending = ALL_INSTRUMENTS
    .map(inst => ({ ...inst, data: prices[inst.symbol] }))
    .filter(i => i.data)
    .sort((a, b) => Math.abs(b.data.changePercent) - Math.abs(a.data.changePercent))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Markets</h1>
          <p className="text-[#787b86] text-sm">Discover instruments and start paper trading</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#787b86]" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search symbols, names..."
            className="h-12 pl-12 text-base bg-[#1e222d] border-[#2a2e39] text-white placeholder:text-[#787b86] rounded-xl"
          />
        </div>

        {/* Trending */}
        {!searchTerm && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-semibold">Trending</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {trending.map(inst => {
                const isUp = inst.data?.changePercent >= 0;
                return (
                  <Link
                    key={inst.symbol}
                    to={createPageUrl('Chart') + `?symbol=${inst.symbol}`}
                    className="bg-[#1e222d] rounded-xl p-4 hover:bg-[#2a2e39] transition-all border border-transparent hover:border-[#2a2e39] group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{inst.symbol}</span>
                      <Badge className={`text-[10px] ${
                        inst.type === 'stock' ? 'bg-blue-500/20 text-blue-400' :
                        inst.type === 'etf' ? 'bg-purple-500/20 text-purple-400' :
                        inst.type === 'crypto' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      } border-0`}>{inst.type}</Badge>
                    </div>
                    <div className="text-xs text-[#787b86] mb-2 truncate">{inst.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold">${inst.data?.price?.toFixed(2)}</span>
                      <span className={`text-xs font-mono flex items-center gap-0.5 ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isUp ? '+' : ''}{inst.data?.changePercent?.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                category === cat
                  ? 'bg-[#2196F3] text-white'
                  : 'bg-[#1e222d] text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Instruments grid */}
        <div className="space-y-1">
          {filtered.map(inst => {
            const data = prices[inst.symbol];
            const isUp = data && data.changePercent >= 0;
            return (
              <Link
                key={inst.symbol}
                to={createPageUrl('Chart') + `?symbol=${inst.symbol}`}
                className="flex items-center justify-between px-4 py-3 bg-[#1e222d] hover:bg-[#2a2e39] rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    inst.type === 'stock' ? 'bg-blue-500/10 text-blue-400' :
                    inst.type === 'etf' ? 'bg-purple-500/10 text-purple-400' :
                    inst.type === 'crypto' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {inst.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{inst.symbol}</div>
                    <div className="text-[11px] text-[#787b86]">{inst.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold">
                      {data ? `$${data.price.toFixed(2)}` : '—'}
                    </div>
                    {data && (
                      <div className={`text-xs font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? '+' : ''}{data.changePercent.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#787b86] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}