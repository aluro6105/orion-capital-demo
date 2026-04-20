import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

// Formatea precio con los decimales adecuados según el instrumento
function fmtPrice(symbol, price) {
  if (!price && price !== 0) return '—';
  // Pares forex y commodities con precio < 10: 5 decimales
  const isForex = /^(EUR|GBP|AUD|NZD|USD|CHF|CAD|JPY|MXN|BRL|COP|CLP|ARS|INR|CNY|ZAR|TRY|HKD|SGD|NOK|SEK|XAU|XAG|XPT|XPD|WTI|BRT|NAT|WHT|COR|SOY|COF|SUG|CTT|CAC|COP2|ALM|NIC|ZN)/.test(symbol);
  const isJPY = symbol.includes('JPY');
  if (isJPY) return price.toFixed(3);
  if (price < 10 && isForex) return price.toFixed(5);
  if (price < 1) return price.toFixed(6);
  if (price >= 10000) return price.toFixed(1);
  return price.toFixed(2);
}

export default function TradePanel({ symbol, currentPrice, account, positions, onTrade }) {
  const [qty, setQty] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const position = positions?.find(p => p.symbol === symbol);
  const cash = account?.current_cash || 0;
  // Usar precio actual o fallback 0; los botones esperan a que llegue el precio
  const price = currentPrice ?? 0;
  const priceReady = price > 0;
  const qtyNum = parseFloat(qty) || 0;
  const leverage = account?.leverage || 500;

  // Margen requerido = valor nocional / apalancamiento
  const notional = qtyNum * price;
  const margin = leverage > 0 ? notional / leverage : notional;

  const hasEnoughCash = margin <= cash && margin > 0;
  const canBuy = submitting ? false : (priceReady && qtyNum > 0 && hasEnoughCash);
  const canSell = submitting ? false : (priceReady && qtyNum > 0 && !!position && position.qty >= qtyNum);

  const handleQuickTrade = async (side) => {
    if (!priceReady) { toast.error('Esperando precio de mercado…'); return; }
    if (side === 'buy' && !hasEnoughCash) { toast.error('Fondos insuficientes'); return; }
    if (side === 'sell' && !position) { toast.error('Sin posición abierta para vender'); return; }
    if (side === 'sell' && position.qty < qtyNum) { toast.error(`Solo tienes ${position.qty} unidades`); return; }
    setSubmitting(true);
    await onTrade({ side, orderType: 'market', qty: qtyNum, price, symbol });
    setSubmitting(false);
  };

  const maxBuyQty = priceReady && leverage > 0 ? Math.floor((cash * leverage) / price) : 0;
  const priceLabel = priceReady ? fmtPrice(symbol, price) : '...';

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-3.5 w-3.5 text-[#2196F3]" />
        <span className="text-xs font-semibold text-[#d1d4dc] uppercase tracking-wider">Trading Rápido</span>
        <span className="text-xs font-bold text-white ml-auto">{symbol}</span>
      </div>

      {/* Current price display */}
      <div className="bg-[#1e222d] rounded-lg p-2 mb-3 text-center">
        <div className="text-[10px] text-[#787b86] uppercase">Precio actual</div>
        <div className={`text-xl font-bold font-mono ${priceReady ? 'text-white' : 'text-[#4a5568]'}`}>
          {priceReady ? priceLabel : <span className="animate-pulse">Cargando…</span>}
        </div>
      </div>

      {/* Quantity input */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <Label className="text-[10px] text-[#787b86] uppercase">Cantidad (unidades)</Label>
          <div className="flex gap-1">
            {position && position.qty > 0 && (
              <button onClick={() => setQty(String(position.qty))} className="text-[9px] text-[#ef5350] hover:underline px-1">
                Pos: {position.qty}
              </button>
            )}
            <button onClick={() => setQty(String(maxBuyQty))} className="text-[9px] text-[#26a69a] hover:underline px-1">
              Max: {maxBuyQty}
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 5, 10, 25].map(q => (
            <button
              key={q}
              onClick={() => setQty(String(q))}
              className={`flex-1 py-1.5 rounded text-[10px] font-semibold transition-colors ${
                qty === String(q) ? 'bg-[#2196F3] text-white' : 'bg-[#1e222d] text-[#787b86] hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
          <Input
            type="number"
            inputMode="decimal"
            min="1"
            value={qty}
            onChange={e => setQty(e.target.value)}
            className="w-16 h-7 text-xs bg-[#1e222d] border-[#2a2e39] text-white font-mono text-center"
          />
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-[#1e222d] rounded p-2 mb-3 space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Valor nocional</span>
          <span className="text-white font-semibold font-mono">{priceReady ? `$${notional.toFixed(2)}` : '—'}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Margen req. (1:{leverage})</span>
          <span className="text-[#2196F3] font-semibold font-mono">{priceReady ? `$${margin.toFixed(4)}` : '—'}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Efectivo disponible</span>
          <span className="text-[#d1d4dc] font-mono">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {position && position.qty > 0 && (
          <div className="flex justify-between text-[10px]">
            <span className="text-[#787b86]">Posición actual</span>
            <span className="text-[#d1d4dc] font-mono">{position.qty} @ {fmtPrice(symbol, position.avg_price)}</span>
          </div>
        )}
      </div>

      {/* Quick trade buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleQuickTrade('buy')}
          disabled={submitting}
          className={`h-12 rounded-md text-sm font-bold text-white flex flex-col items-center justify-center gap-0 transition-colors
            ${submitting ? 'opacity-50 cursor-not-allowed bg-[#26a69a]' : !canBuy ? 'bg-[#26a69a]/40 cursor-not-allowed' : 'bg-[#26a69a] hover:bg-[#2bbbad] active:scale-95'}`}
        >
          <span className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4" />
            COMPRAR
          </span>
          <span className="text-[10px] font-normal opacity-75">{qtyNum} × {priceLabel}</span>
        </button>
        <button
          onClick={() => handleQuickTrade('sell')}
          disabled={submitting}
          className={`h-12 rounded-md text-sm font-bold text-white flex flex-col items-center justify-center gap-0 transition-colors
            ${submitting ? 'opacity-50 cursor-not-allowed bg-[#ef5350]' : !canSell ? 'bg-[#ef5350]/40 cursor-not-allowed' : 'bg-[#ef5350] hover:bg-[#f44336] active:scale-95'}`}
        >
          <span className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4" />
            VENDER
          </span>
          <span className="text-[10px] font-normal opacity-75">{qtyNum} × {priceLabel}</span>
        </button>
      </div>

      {/* Estado */}
      {!priceReady && (
        <p className="text-[9px] text-yellow-500 text-center mt-2">Esperando precio de mercado…</p>
      )}
      {priceReady && !canBuy && !position && (
        <p className="text-[9px] text-[#787b86] text-center mt-2">
          {cash === 0 ? 'Sin fondos disponibles' : `Margen requerido: $${margin.toFixed(4)} | Disponible: $${cash.toFixed(2)}`}
        </p>
      )}
      <p className="text-[9px] text-[#787b86] text-center mt-1 leading-relaxed">
        Configura TP/SL desde la pestaña "Posiciones"
      </p>
    </div>
  );
}