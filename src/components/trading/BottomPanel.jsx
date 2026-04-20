import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Target, ShieldAlert, X, Check, Edit3 } from 'lucide-react';
import priceEngine from './PriceEngine';
import { toast } from 'sonner';

// Formatea precio con decimales correctos según instrumento
function fmtPrice(symbol, price) {
  if (price == null || isNaN(price)) return '—';
  if (!symbol) return price.toFixed(2);
  const sym = symbol.toUpperCase();
  if (sym.includes('JPY')) return price.toFixed(3);
  // Pares forex/commodities con precio menor a 100 (EUR, GBP, AUD, etc.)
  const isSmallForex = price > 0 && price < 100 && (
    sym.endsWith('USD') || sym.startsWith('USD') ||
    sym.endsWith('EUR') || sym.endsWith('GBP') || sym.endsWith('CHF') ||
    sym.endsWith('CAD') || sym.endsWith('NZD') || sym.endsWith('AUD')
  ) && !['SPX500','US30','NAS100','RUT2000','GER40','UK100','FRA40','ESP35','EU50','JPN225','HK50','AUS200','IND50'].includes(sym);
  if (isSmallForex && price < 10) return price.toFixed(5);
  if (price < 1) return price.toFixed(6);
  if (price >= 10000) return price.toFixed(1);
  return price.toFixed(2);
}

export default function BottomPanel({ positions, trades, account, equitySnapshots, onUpdatePosition, onClosePosition }) {
  const [tab, setTab] = useState('positions');
  const [livePrices, setLivePrices] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editTP, setEditTP] = useState('');
  const [editSL, setEditSL] = useState('');

  useEffect(() => {
    const unsubs = [];
    (positions || []).forEach(pos => {
      const unsub = priceEngine.subscribe(pos.symbol, (data) => {
        setLivePrices(prev => ({ ...prev, [data.symbol]: data.price }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [positions]);

  const exportCSV = () => {
    if (!trades || trades.length === 0) return;
    const headers = ['Date', 'Symbol', 'Side', 'Type', 'Qty', 'Price', 'Fee', 'Total', 'P&L'];
    const rows = trades.map(t => [
      new Date(t.created_date).toLocaleString(),
      t.symbol, t.side, t.order_type, t.qty,
      t.price?.toFixed(2), t.fee?.toFixed(2), t.total?.toFixed(2), t.realized_pnl?.toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'trades.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const totalUnrealized = (positions || []).reduce((sum, p) => {
    const last = livePrices[p.symbol] || p.avg_price;
    return sum + ((last - p.avg_price) * p.qty);
  }, 0);

  const equity = (account?.current_cash || 0) + (positions || []).reduce((sum, p) => {
    const last = livePrices[p.symbol] || p.avg_price;
    return sum + (last * p.qty);
  }, 0);

  const startEdit = (pos) => {
    setEditingId(pos.id);
    setEditTP(pos.take_profit ? String(pos.take_profit) : '');
    setEditSL(pos.stop_loss ? String(pos.stop_loss) : '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTP('');
    setEditSL('');
  };

  const saveTPSL = async (pos) => {
    const tp = parseFloat(editTP) || null;
    const sl = parseFloat(editSL) || null;
    
    if (onUpdatePosition) {
      await onUpdatePosition(pos.id, { take_profit: tp, stop_loss: sl });
      toast.success('TP/SL actualizado');
    }
    cancelEdit();
  };

  const handleClose = async (pos) => {
    if (onClosePosition) {
      const currentPrice = livePrices[pos.symbol] || pos.avg_price;
      await onClosePosition(pos, currentPrice);
    }
  };

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] flex flex-col" style={{ minHeight: 180 }}>
      <Tabs value={tab} onValueChange={setTab} className="flex flex-col h-full">
        <div className="flex items-center justify-between px-3 border-b border-[#2a2e39]">
          <TabsList className="bg-transparent border-0 h-8 gap-0">
            <TabsTrigger value="positions" className="text-[10px] uppercase font-semibold px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2196F3] rounded-none text-[#787b86]">
              Posiciones
            </TabsTrigger>
            <TabsTrigger value="trades" className="text-[10px] uppercase font-semibold px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2196F3] rounded-none text-[#787b86]">
              Operaciones
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-[10px] uppercase font-semibold px-3 py-1.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2196F3] rounded-none text-[#787b86]">
              Rendimiento
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[#787b86]">Patrimonio: <span className="text-white font-mono font-semibold">${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
            <span className={`font-mono ${totalUnrealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
              P&L: {totalUnrealized >= 0 ? '+' : ''}{totalUnrealized.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="positions" className="m-0 h-full">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-[#787b86] uppercase text-[10px]">
                  <th className="text-left p-2 font-medium">Símbolo</th>
                  <th className="text-right p-2 font-medium">Cant.</th>
                  <th className="text-right p-2 font-medium">P. Prom.</th>
                  <th className="text-right p-2 font-medium">Último</th>
                  <th className="text-right p-2 font-medium">G/P</th>
                  <th className="text-center p-2 font-medium">
                    <span className="text-[#26a69a]">TP</span> / <span className="text-[#ef5350]">SL</span>
                  </th>
                  <th className="text-center p-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(positions || []).filter(p => p.qty > 0).map(p => {
                  const last = livePrices[p.symbol] || p.avg_price;
                  const pnl = (last - p.avg_price) * p.qty;
                  const pnlPct = p.avg_price > 0 ? ((last - p.avg_price) / p.avg_price * 100) : 0;
                  const isUp = pnl >= 0;
                  const isEditing = editingId === p.id;

                  return (
                    <tr key={p.id || p.symbol} className="border-t border-[#1e222d] hover:bg-[#1e222d]/50">
                      <td className="p-2 font-semibold text-white">{p.symbol}</td>
                      <td className="p-2 text-right text-[#d1d4dc] font-mono">{p.qty}</td>
                      <td className="p-2 text-right text-[#d1d4dc] font-mono">{fmtPrice(p.symbol, p.avg_price)}</td>
                      <td className="p-2 text-right text-[#d1d4dc] font-mono">{fmtPrice(p.symbol, last)}</td>
                      <td className={`p-2 text-right font-mono font-semibold ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {isUp ? '+' : ''}{pnl.toFixed(2)} ({isUp ? '+' : ''}{pnlPct.toFixed(2)}%)
                      </td>
                      <td className="p-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1 justify-center">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-0.5">
                                <Target className="h-3 w-3 text-[#26a69a]" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editTP}
                                  onChange={e => setEditTP(e.target.value)}
                                  placeholder="TP"
                                  className="h-5 w-16 text-[10px] bg-[#1e222d] border-[#26a69a]/40 text-white font-mono px-1"
                                />
                              </div>
                              <div className="flex items-center gap-0.5">
                                <ShieldAlert className="h-3 w-3 text-[#ef5350]" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editSL}
                                  onChange={e => setEditSL(e.target.value)}
                                  placeholder="SL"
                                  className="h-5 w-16 text-[10px] bg-[#1e222d] border-[#ef5350]/40 text-white font-mono px-1"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <button onClick={() => saveTPSL(p)} className="p-1 rounded bg-[#26a69a]/20 hover:bg-[#26a69a]/30 text-[#26a69a]">
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={cancelEdit} className="p-1 rounded bg-[#ef5350]/20 hover:bg-[#ef5350]/30 text-[#ef5350]">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-[10px] font-mono">
                            {p.take_profit ? (
                              <span className="text-[#26a69a]">{fmtPrice(p.symbol, p.take_profit)}</span>
                            ) : (
                              <span className="text-[#787b86]">—</span>
                            )}
                            <span className="text-[#787b86]">/</span>
                            {p.stop_loss ? (
                              <span className="text-[#ef5350]">{fmtPrice(p.symbol, p.stop_loss)}</span>
                            ) : (
                              <span className="text-[#787b86]">—</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(p)}
                              className="p-1.5 rounded bg-[#2196F3]/20 hover:bg-[#2196F3]/30 text-[#2196F3] transition-colors"
                              title="Configurar TP/SL"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleClose(p)}
                            className="px-2 py-1 rounded bg-[#ef5350]/20 hover:bg-[#ef5350]/30 text-[#ef5350] text-[9px] font-semibold transition-colors"
                            title="Cerrar posición"
                          >
                            CERRAR
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!positions || positions.filter(p => p.qty > 0).length === 0) && (
                  <tr><td colSpan={7} className="p-4 text-center text-[#787b86]">Sin posiciones abiertas</td></tr>
                )}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="trades" className="m-0 h-full">
            <div className="flex justify-end px-2 pt-1">
              <Button variant="ghost" size="sm" onClick={exportCSV} className="h-6 text-[10px] text-[#787b86] hover:text-white">
                <Download className="h-3 w-3 mr-1" /> Exportar CSV
              </Button>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-[#787b86] uppercase text-[10px]">
                  <th className="text-left p-2 font-medium">Fecha</th>
                  <th className="text-left p-2 font-medium">Símbolo</th>
                  <th className="text-left p-2 font-medium">Tipo</th>
                  <th className="text-right p-2 font-medium">Cant.</th>
                  <th className="text-right p-2 font-medium">Precio</th>
                  <th className="text-right p-2 font-medium">Total</th>
                  <th className="text-right p-2 font-medium">G/P</th>
                </tr>
              </thead>
              <tbody>
                {(trades || []).map(t => (
                  <tr key={t.id} className="border-t border-[#1e222d] hover:bg-[#1e222d]/50">
                    <td className="p-2 text-[#d1d4dc] font-mono">{new Date(t.created_date).toLocaleDateString()}</td>
                    <td className="p-2 font-semibold text-white">{t.symbol}</td>
                    <td className={`p-2 font-semibold ${t.side === 'buy' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                      {t.side?.toUpperCase()}
                    </td>
                    <td className="p-2 text-right text-[#d1d4dc] font-mono">{t.qty}</td>
                    <td className="p-2 text-right text-[#d1d4dc] font-mono">{fmtPrice(t.symbol, t.price)}</td>
                    <td className="p-2 text-right text-[#d1d4dc] font-mono">${t.total?.toFixed(2)}</td>
                    <td className={`p-2 text-right font-mono ${(t.realized_pnl || 0) >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                      {t.realized_pnl ? `${t.realized_pnl >= 0 ? '+' : ''}${t.realized_pnl.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))}
                {(!trades || trades.length === 0) && (
                  <tr><td colSpan={7} className="p-4 text-center text-[#787b86]">Sin operaciones aún</td></tr>
                )}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="performance" className="m-0 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Patrimonio</div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Efectivo</div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  ${(account?.current_cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">G/P No Realizada</div>
                <div className={`text-lg font-bold font-mono mt-1 ${totalUnrealized >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                  {totalUnrealized >= 0 ? '+' : ''}{totalUnrealized.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase">Total Operaciones</div>
                <div className="text-lg font-bold text-white font-mono mt-1">{trades?.length || 0}</div>
              </div>
            </div>

            {/* Win rate */}
            {trades && trades.length > 0 && (
              <div className="mt-3 bg-[#1e222d] rounded-lg p-3">
                <div className="text-[10px] text-[#787b86] uppercase mb-2">Estadísticas</div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#787b86]">Ganancias: </span>
                    <span className="text-[#26a69a] font-mono">{trades.filter(t => (t.realized_pnl || 0) > 0).length}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86]">Pérdidas: </span>
                    <span className="text-[#ef5350] font-mono">{trades.filter(t => (t.realized_pnl || 0) < 0).length}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86]">Tasa de Acierto: </span>
                    <span className="text-white font-mono">
                      {trades.filter(t => t.realized_pnl).length > 0
                        ? (trades.filter(t => (t.realized_pnl || 0) > 0).length / trades.filter(t => t.realized_pnl).length * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}