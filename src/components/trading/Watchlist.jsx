import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, X, TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import priceEngine from './PriceEngine';

export default function Watchlist({ items, instruments, activeSymbol, onSelectSymbol, onReorder, onRemove, onAdd }) {
  const [prices, setPrices] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubs = [];
    const symbols = items.map(i => i.symbol);
    symbols.forEach(sym => {
      const unsub = priceEngine.subscribe(sym, (data) => {
        setPrices(prev => ({ ...prev, [data.symbol]: data }));
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => u());
  }, [items]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  const filteredInstruments = instruments.filter(inst =>
    !items.find(i => i.symbol === inst.symbol) &&
    (inst.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inst.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2e39]">
        <span className="text-xs font-semibold text-[#d1d4dc] uppercase tracking-wider">Lista de seguimiento</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-[#787b86] hover:text-white hover:bg-[#2a2e39]" onClick={() => setShowSearch(!showSearch)}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {showSearch && (
        <div className="p-2 border-b border-[#2a2e39]">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#787b86]" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Agregar símbolo..."
              className="h-7 pl-7 text-xs bg-[#1e222d] border-[#2a2e39] text-white placeholder:text-[#787b86]"
              autoFocus
            />
          </div>
          {searchTerm && (
            <div className="mt-1 max-h-32 overflow-y-auto">
              {filteredInstruments.slice(0, 8).map(inst => (
                <button
                  key={inst.symbol}
                  onClick={() => { onAdd(inst); setSearchTerm(''); setShowSearch(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#d1d4dc] hover:bg-[#2a2e39] rounded flex justify-between"
                >
                  <span className="font-medium">{inst.symbol}</span>
                  <span className="text-[#787b86]">{inst.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="watchlist">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto">
              {items.map((item, index) => {
                const data = prices[item.symbol];
                const isActive = item.symbol === activeSymbol;
                const isUp = data && data.changePercent >= 0;
                return (
                  <Draggable key={item.symbol} draggableId={item.symbol} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onClick={() => onSelectSymbol(item.symbol)}
                        className={`group flex items-center px-2 py-2 cursor-pointer transition-colors border-l-2 ${
                          isActive ? 'bg-[#1e222d] border-[#2196F3]' : 'border-transparent hover:bg-[#1e222d]/50'
                        } ${snapshot.isDragging ? 'bg-[#2a2e39]' : ''}`}
                      >
                        <div {...provided.dragHandleProps} className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-3 w-3 text-[#787b86]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#d1d4dc]">{item.symbol}</span>
                            <span className="text-xs font-mono text-[#d1d4dc]">
                              {data ? formatNum(data.price, item.symbol) : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[10px] text-[#787b86] truncate mr-2">
                              {instruments.find(i => i.symbol === item.symbol)?.name || item.symbol}
                            </span>
                            {data && (
                              <span className={`text-[10px] font-mono flex items-center gap-0.5 ${isUp ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                                {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                                {isUp ? '+' : ''}{data.changePercent.toFixed(2)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemove(item.symbol); }}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#787b86] hover:text-[#ef5350]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {items.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-[#787b86]">
          Haz clic en + para agregar símbolos
        </div>
      )}
    </div>
  );
}

function formatNum(price, symbol) {
  if (!price) return '—';
  if (symbol === 'EURUSD' || symbol === 'GBPUSD') return price.toFixed(4);
  if (symbol === 'BTCUSD') return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(2);
}