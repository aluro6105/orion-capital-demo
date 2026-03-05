import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SymbolDetails({ symbol, name, type, priceData, candles }) {
  if (!priceData) return null;

  const isUp = priceData.changePercent >= 0;
  const lastCandle = candles && candles.length > 0 ? candles[candles.length - 1] : null;

  return (
    <div className="px-3 py-2 border-b border-[#2a2e39] bg-[#131722]">
      <div className="flex items-center gap-2 mb-1">
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
          type === 'stock' ? 'bg-blue-500/20 text-blue-400' :
          type === 'etf' ? 'bg-purple-500/20 text-purple-400' :
          type === 'crypto' ? 'bg-orange-500/20 text-orange-400' :
          'bg-green-500/20 text-green-400'
        }`}>{type}</span>
        <span className="text-[10px] text-[#787b86] truncate">{name}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        <div className="flex justify-between">
          <span className="text-[#787b86]">Last</span>
          <span className={`font-mono font-semibold ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {priceData.price?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#787b86]">Change</span>
          <span className={`font-mono ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
            {isUp ? '+' : ''}{priceData.changePercent?.toFixed(2)}%
          </span>
        </div>
        {lastCandle && (
          <>
            <div className="flex justify-between">
              <span className="text-[#787b86]">High</span>
              <span className="text-[#d1d4dc] font-mono">{lastCandle.high?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#787b86]">Low</span>
              <span className="text-[#d1d4dc] font-mono">{lastCandle.low?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#787b86]">Open</span>
              <span className="text-[#d1d4dc] font-mono">{lastCandle.open?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#787b86]">Vol</span>
              <span className="text-[#d1d4dc] font-mono">{(lastCandle.volume / 1000000).toFixed(1)}M</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}