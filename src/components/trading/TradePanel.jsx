import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function TradePanel({ symbol, currentPrice, account, positions, onTrade }) {
  const [qty, setQty] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const position = positions?.find(p => p.symbol === symbol);
  const cash = account?.current_cash || 0;
  const price = currentPrice || 0;
  const qtyNum = parseFloat(qty) || 0;
  const leverage = account?.leverage || 500;
  // Margen requerido = valor nocional / apalancamiento
  const notional = qtyNum * price;
  const margin = leverage > 0 ? notional / leverage : notional;
  const total = margin; // lo que realmente se bloquea del efectivo

  const canBuy = qtyNum > 0 && price > 0 && margin <= cash;
  const canSell = qtyNum > 0 && price > 0 && position && position.qty >= qtyNum;

  const handleQuickTrade = async (side) => {
    if (side === 'buy' && !canBuy) {
      toast.error(total > cash ? 'Fondos insuficientes' : 'Orden inválida');
      return;
    }
    if (side === 'sell' && !canSell) {
      toast.error(!position ? 'Sin posición para vender' : position.qty < qtyNum ? 'Acciones insuficientes' : 'Orden inválida');
      return;
    }
    setSubmitting(true);
    await onTrade({ side, orderType: 'market', qty: qtyNum, price, symbol });
    setSubmitting(false);
  };

  const maxBuyQty = price > 0 && leverage > 0 ? Math.floor((cash * leverage) / price) : 0;

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-3.5 w-3.5 text-[#2196F3]" />
        <span className="text-xs font-semibold text-[#d1d4dc] uppercase tracking-wider">Trading Rápido</span>
        <span className="text-xs font-bold text-white ml-auto">{symbol}</span>
      </div>

      {/* Current price display */}
      {currentPrice && (
        <div className="bg-[#1e222d] rounded-lg p-2 mb-3 text-center">
          <div className="text-[10px] text-[#787b86] uppercase">Precio actual</div>
          <div className="text-xl font-bold text-white font-mono">${currentPrice.toFixed(2)}</div>
        </div>
      )}

      {/* Quantity input */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <Label className="text-[10px] text-[#787b86] uppercase">Cantidad</Label>
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
          <span className="text-white font-semibold font-mono">${notional.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Margen requerido (1:{leverage})</span>
          <span className="text-[#2196F3] font-semibold font-mono">${margin.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Efectivo disponible</span>
          <span className="text-[#d1d4dc] font-mono">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {position && position.qty > 0 && (
          <div className="flex justify-between text-[10px]">
            <span className="text-[#787b86]">Posición actual</span>
            <span className="text-[#d1d4dc] font-mono">{position.qty} @ ${position.avg_price?.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Quick trade buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => handleQuickTrade('buy')}
          disabled={submitting || !canBuy}
          className="h-12 text-sm font-bold bg-[#26a69a] hover:bg-[#26a69a]/90 text-white flex flex-col items-center justify-center gap-0"
        >
          <span className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4" />
            COMPRAR
          </span>
          <span className="text-[10px] font-normal opacity-75">{qtyNum} × ${price.toFixed(2)}</span>
        </Button>
        <Button
          onClick={() => handleQuickTrade('sell')}
          disabled={submitting || !canSell}
          className="h-12 text-sm font-bold bg-[#ef5350] hover:bg-[#ef5350]/90 text-white flex flex-col items-center justify-center gap-0"
        >
          <span className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4" />
            VENDER
          </span>
          <span className="text-[10px] font-normal opacity-75">{qtyNum} × ${price.toFixed(2)}</span>
        </Button>
      </div>

      {/* Hint */}
      <p className="text-[9px] text-[#787b86] text-center mt-2 leading-relaxed">
        Configura TP/SL después de abrir la posición desde la pestaña "Posiciones"
      </p>
    </div>
  );
}