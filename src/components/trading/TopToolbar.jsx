import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, BarChart3, LineChart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1H', value: '60' },
  { label: '1D', value: 'D' },
];

export default function TopToolbar({
  symbol, symbolName, instruments, timeframe, chartType, indicators,
  onSymbolChange, onTimeframeChange, onChartTypeChange, onIndicatorsChange, priceData,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const filtered = instruments.filter(i =>
    i.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUp = priceData && priceData.changePercent >= 0;

  const toggleIndicator = (ind) => {
    if (indicators.includes(ind)) {
      onIndicatorsChange(indicators.filter(i => i !== ind));
    } else {
      onIndicatorsChange([...indicators, ind]);
    }
  };

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1e222d] border-b border-[#2a2e39] flex-wrap">
      {/* Symbol selector */}
      <div className="relative">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2a2e39] transition-colors"
        >
          <span className="text-sm font-bold text-white">{symbol}</span>
          <span className="text-xs text-[#787b86] hidden sm:inline">{symbolName}</span>
          <ChevronDown className="h-3 w-3 text-[#787b86]" />
        </button>

        {searchOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-72 bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#787b86]" />
                  <Input
                    ref={searchRef}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar símbolo..."
                    className="h-8 pl-8 text-xs bg-[#131722] border-[#2a2e39] text-white"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filtered.map(inst => (
                  <button
                    key={inst.symbol}
                    onClick={() => { onSymbolChange(inst.symbol); setSearchOpen(false); setSearchTerm(''); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#2a2e39] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{inst.symbol}</span>
                      <span className="text-[#787b86] truncate max-w-[120px]">{inst.name}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                      inst.type === 'stock' ? 'bg-blue-500/20 text-blue-400' :
                      inst.type === 'etf' ? 'bg-purple-500/20 text-purple-400' :
                      inst.type === 'crypto' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{inst.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Price display */}
      {priceData && (
        <div className="flex items-center gap-2 px-2">
          <span className={`text-sm font-bold font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {priceData.price?.toFixed(2)}
          </span>
          <span className={`text-xs font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {isUp ? '+' : ''}{priceData.changePercent?.toFixed(2)}%
          </span>
        </div>
      )}

      <div className="h-5 w-px bg-[#2a2e39] mx-1" />

      {/* Timeframes */}
      <div className="flex items-center gap-0.5">
        {TIMEFRAMES.map(tf => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              timeframe === tf.value
                ? 'bg-[#2196F3]/20 text-[#2196F3] font-semibold'
                : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="h-5 w-px bg-[#2a2e39] mx-1" />

      {/* Chart type */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onChartTypeChange('candles')}
          className={`p-1.5 rounded transition-colors ${chartType === 'candles' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'}`}
          title="Candlestick"
        >
          <BarChart3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onChartTypeChange('line')}
          className={`p-1.5 rounded transition-colors ${chartType === 'line' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'}`}
          title="Line"
        >
          <LineChart className="h-4 w-4" />
        </button>
      </div>

      <div className="h-5 w-px bg-[#2a2e39] mx-1" />

      {/* Indicators */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#787b86] hover:text-white hover:bg-[#2a2e39] rounded transition-colors">
            <Activity className="h-3.5 w-3.5" />
            <span>Indicadores</span>
            {indicators.length > 0 && (
              <span className="bg-[#2196F3] text-white text-[10px] rounded-full px-1.5">{indicators.length}</span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#1e222d] border-[#2a2e39] min-w-[160px]">
          <div className="px-2 py-1 text-[10px] text-[#787b86] uppercase tracking-wider">Medias Móviles</div>
          {[
            { key: 'SMA20', label: 'SMA 20', color: '#2196F3' },
            { key: 'SMA50', label: 'SMA 50', color: '#FF9800' },
            { key: 'EMA9',  label: 'EMA 9',  color: '#E91E63' },
            { key: 'EMA21', label: 'EMA 21', color: '#9C27B0' },
            { key: 'EMA50', label: 'EMA 50', color: '#FF5722' },
          ].map(({ key, label, color }) => (
            <DropdownMenuCheckboxItem key={key}
              checked={indicators.includes(key)}
              onCheckedChange={() => toggleIndicator(key)}
              className="text-[#d1d4dc] text-xs"
            >
              <span className="w-2 h-2 rounded-full inline-block mr-2 flex-shrink-0" style={{ background: color }} />
              {label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator className="bg-[#2a2e39]" />
          <div className="px-2 py-1 text-[10px] text-[#787b86] uppercase tracking-wider">Osciladores</div>
          <DropdownMenuCheckboxItem
            checked={indicators.includes('RSI')}
            onCheckedChange={() => toggleIndicator('RSI')}
            className="text-[#d1d4dc] text-xs"
          >
            <span className="w-2 h-2 rounded-full inline-block mr-2 flex-shrink-0 bg-[#00BCD4]" />
            RSI (14)
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator className="bg-[#2a2e39]" />
          <div className="px-2 py-1 text-[10px] text-[#787b86] uppercase tracking-wider">Otros</div>
          <DropdownMenuCheckboxItem
            checked={indicators.includes('FIB')}
            onCheckedChange={() => toggleIndicator('FIB')}
            className="text-[#d1d4dc] text-xs"
          >
            <span className="w-2 h-2 rounded-full inline-block mr-2 flex-shrink-0 bg-yellow-400" />
            Fibonacci
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}