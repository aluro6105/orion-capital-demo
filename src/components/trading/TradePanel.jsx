import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownRight, Target, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function TradePanel({ symbol, currentPrice, account, positions, onTrade }) {
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [qty, setQty] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const position = positions?.find(p => p.symbol === symbol);
  const cash = account?.current_cash || 0;
  const price = orderType === 'limit' ? (parseFloat(limitPrice) || 0) : (currentPrice || 0);
  const total = (parseFloat(qty) || 0) * price;
  const qtyNum = parseFloat(qty) || 0;
  const tpPrice = parseFloat(takeProfit) || 0;
  const slPrice = parseFloat(stopLoss) || 0;

  // TP/SL P&L calculations
  const tpPnl = tpPrice > 0 && price > 0 && qtyNum > 0
    ? (side === 'buy' ? (tpPrice - price) : (price - tpPrice)) * qtyNum : null;
  const slPnl = slPrice > 0 && price > 0 && qtyNum > 0
    ? (side === 'buy' ? (slPrice - price) : (price - slPrice)) * qtyNum : null;
  const tpPct = tpPrice > 0 && price > 0
    ? ((side === 'buy' ? tpPrice - price : price - tpPrice) / price * 100) : null;
  const slPct = slPrice > 0 && price > 0
    ? ((side === 'buy' ? slPrice - price : price - slPrice) / price * 100) : null;

  const canBuy = qtyNum > 0 && price > 0 && total <= cash;
  const canSell = qtyNum > 0 && price > 0 && position && position.qty >= qtyNum;

  const handleSubmit = async () => {
    if (side === 'buy' && !canBuy) {
      toast.error(total > cash ? 'Fondos insuficientes' : 'Orden inválida');
      return;
    }
    if (side === 'sell' && !canSell) {
      toast.error(!position ? 'Sin posición para vender' : position.qty < qtyNum ? 'Acciones insuficientes' : 'Orden inválida');
      return;
    }
    setSubmitting(true);
    await onTrade({ side, orderType, qty: qtyNum, price, symbol, takeProfit: tpPrice || undefined, stopLoss: slPrice || undefined });
    setQty('');
    setLimitPrice('');
    setTakeProfit('');
    setStopLoss('');
    setSubmitting(false);
  };

  const maxBuyQty = price > 0 ? Math.floor(cash / price) : 0;

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-[#d1d4dc] uppercase tracking-wider">Operar</span>
        <span className="text-xs font-bold text-white">{symbol}</span>
        {currentPrice && (
          <span className="text-xs font-mono text-[#787b86] ml-auto">${currentPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Side toggle */}
      <div className="grid grid-cols-2 gap-1 mb-3">
        <button
          onClick={() => setSide('buy')}
          className={`py-1.5 rounded text-xs font-bold transition-all ${
            side === 'buy' ? 'bg-[#26a69a] text-white' : 'bg-[#1e222d] text-[#787b86] hover:text-white'
          }`}
        >
          <ArrowUpRight className="h-3 w-3 inline mr-1" />COMPRAR
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`py-1.5 rounded text-xs font-bold transition-all ${
            side === 'sell' ? 'bg-[#ef5350] text-white' : 'bg-[#1e222d] text-[#787b86] hover:text-white'
          }`}
        >
          <ArrowDownRight className="h-3 w-3 inline mr-1" />VENDER
        </button>
      </div>

      {/* Order type */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setOrderType('market')}
          className={`flex-1 py-1 rounded text-[10px] font-semibold uppercase ${
            orderType === 'market' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86]'
          }`}
        >Mercado</button>
        <button
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-1 rounded text-[10px] font-semibold uppercase ${
            orderType === 'limit' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86]'
          }`}
        >Límite</button>
      </div>

      {/* Qty */}
      <div className="space-y-2 mb-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[10px] text-[#787b86] uppercase">Cantidad</Label>
            {side === 'buy' && (
              <button onClick={() => setQty(String(maxBuyQty))} className="text-[10px] text-[#2196F3] hover:underline">
                Max: {maxBuyQty}
              </button>
            )}
            {side === 'sell' && position && (
              <button onClick={() => setQty(String(position.qty))} className="text-[10px] text-[#2196F3] hover:underline">
                Max: {position.qty}
              </button>
            )}
          </div>
          <Input
            type="number" min="0" value={qty}
            onChange={e => setQty(e.target.value)}
            className="h-8 text-xs bg-[#1e222d] border-[#2a2e39] text-white font-mono"
            placeholder="0"
          />
        </div>
        {orderType === 'limit' && (
          <div>
            <Label className="text-[10px] text-[#787b86] uppercase">Precio Límite</Label>
            <Input
              type="number" min="0" step="0.01" value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              className="h-8 text-xs bg-[#1e222d] border-[#2a2e39] text-white font-mono mt-1"
              placeholder="0.00"
            />
          </div>
        )}
      </div>

      {/* TP / SL */}
      <div className="space-y-2 mb-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[10px] text-[#26a69a] uppercase flex items-center gap-1">
              <Target className="h-3 w-3" /> Take Profit
            </Label>
            {tpPnl !== null && (
              <span className={`text-[10px] font-mono ${tpPnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {tpPnl >= 0 ? '+' : ''}${tpPnl.toFixed(2)} ({tpPct >= 0 ? '+' : ''}{tpPct?.toFixed(2)}%)
              </span>
            )}
          </div>
          <Input
            type="number" min="0" step="0.01" value={takeProfit}
            onChange={e => setTakeProfit(e.target.value)}
            className="h-8 text-xs bg-[#1e222d] border-[#26a69a]/40 text-white font-mono focus:border-[#26a69a]"
            placeholder={price > 0 ? `>${(price * (side === 'buy' ? 1.02 : 0.98)).toFixed(2)}` : 'Precio TP'}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[10px] text-[#ef5350] uppercase flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Stop Loss
            </Label>
            {slPnl !== null && (
              <span className={`text-[10px] font-mono ${slPnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {slPnl >= 0 ? '+' : ''}${slPnl.toFixed(2)} ({slPct >= 0 ? '+' : ''}{slPct?.toFixed(2)}%)
              </span>
            )}
          </div>
          <Input
            type="number" min="0" step="0.01" value={stopLoss}
            onChange={e => setStopLoss(e.target.value)}
            className="h-8 text-xs bg-[#1e222d] border-[#ef5350]/40 text-white font-mono focus:border-[#ef5350]"
            placeholder={price > 0 ? `<${(price * (side === 'buy' ? 0.98 : 1.02)).toFixed(2)}` : 'Precio SL'}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#1e222d] rounded p-2 mb-3 space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Precio</span>
          <span className="text-[#d1d4dc] font-mono">${price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Total</span>
          <span className="text-white font-semibold font-mono">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#787b86]">Efectivo disponible</span>
          <span className="text-[#d1d4dc] font-mono">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {position && (
          <div className="flex justify-between text-[10px]">
            <span className="text-[#787b86]">Posición actual</span>
            <span className="text-[#d1d4dc] font-mono">{position.qty} @ ${position.avg_price?.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitting || (side === 'buy' ? !canBuy : !canSell)}
        className={`w-full h-9 text-xs font-bold ${
          side === 'buy'
            ? 'bg-[#26a69a] hover:bg-[#26a69a]/90 text-white'
            : 'bg-[#ef5350] hover:bg-[#ef5350]/90 text-white'
        }`}
      >
        {submitting ? 'Procesando...' : `${side === 'buy' ? 'COMPRAR' : 'VENDER'} ${symbol}`}
      </Button>
    </div>
  );
}