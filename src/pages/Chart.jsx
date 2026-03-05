import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import TopToolbar from '../components/trading/TopToolbar';
import CandlestickChart from '../components/trading/CandlestickChart';
import Watchlist from '../components/trading/Watchlist';
import SymbolDetails from '../components/trading/SymbolDetails';
import TradePanel from '../components/trading/TradePanel';
import BottomPanel from '../components/trading/BottomPanel';
import priceEngine from '../components/trading/PriceEngine';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { List, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_INSTRUMENTS = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock' },
  { symbol: 'SPY', name: 'SPDR S&P 500', type: 'etf' },
  { symbol: 'QQQ', name: 'Invesco QQQ', type: 'etf' },
  { symbol: 'IWM', name: 'iShares Russell 2000', type: 'etf' },
  { symbol: 'BTCUSD', name: 'Bitcoin/USD', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum/USD', type: 'crypto' },
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
];

export default function ChartPage() {
  const [activeSymbol, setActiveSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('5');
  const [chartType, setChartType] = useState('candles');
  const [indicators, setIndicators] = useState(['SMA20']);
  const [candles, setCandles] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [watchlistItems, setWatchlistItems] = useState([
    { symbol: 'AAPL', order_index: 0 },
    { symbol: 'MSFT', order_index: 1 },
    { symbol: 'TSLA', order_index: 2 },
    { symbol: 'SPY', order_index: 3 },
    { symbol: 'BTCUSD', order_index: 4 },
  ]);
  const [mobileWatchlist, setMobileWatchlist] = useState(false);
  const queryClient = useQueryClient();

  // Load account
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => base44.entities.Account.list(),
    initialData: [],
  });

  const account = accounts?.[0];

  // Auto-create account if none exists
  useEffect(() => {
    if (accounts && accounts.length === 0) {
      base44.entities.Account.create({ starting_cash: 100000, current_cash: 100000 })
        .then(() => queryClient.invalidateQueries({ queryKey: ['accounts'] }));
    }
  }, [accounts]);

  // Load positions
  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => base44.entities.Position.list(),
    initialData: [],
  });

  // Load trades
  const { data: trades } = useQuery({
    queryKey: ['trades'],
    queryFn: () => base44.entities.Trade.list('-created_date', 50),
    initialData: [],
  });

  // Load watchlist items from DB
  const { data: dbWatchlist } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.WatchlistItem.list(),
  });

  useEffect(() => {
    if (dbWatchlist && dbWatchlist.length > 0) {
      setWatchlistItems(dbWatchlist.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
    }
  }, [dbWatchlist]);

  // Generate candles when symbol or timeframe changes
  useEffect(() => {
    const data = priceEngine.generateCandles(activeSymbol, timeframe, 150);
    setCandles(data);
  }, [activeSymbol, timeframe]);

  // Subscribe to live price for active symbol
  useEffect(() => {
    const unsub = priceEngine.subscribe(activeSymbol, (data) => {
      setPriceData(data);
      // Update last candle
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        last.close = data.price;
        last.high = Math.max(last.high, data.price);
        last.low = Math.min(last.low, data.price);
        return [...prev.slice(0, -1), last];
      });
    });
    return unsub;
  }, [activeSymbol]);

  const handleSymbolChange = useCallback((symbol) => {
    setActiveSymbol(symbol);
    setPriceData(null);
  }, []);

  const handleReorder = useCallback((from, to) => {
    setWatchlistItems(prev => {
      const items = [...prev];
      const [removed] = items.splice(from, 1);
      items.splice(to, 0, removed);
      return items.map((item, i) => ({ ...item, order_index: i }));
    });
  }, []);

  const handleRemoveFromWatchlist = useCallback((symbol) => {
    setWatchlistItems(prev => prev.filter(i => i.symbol !== symbol));
  }, []);

  const handleAddToWatchlist = useCallback((inst) => {
    setWatchlistItems(prev => {
      if (prev.find(i => i.symbol === inst.symbol)) return prev;
      return [...prev, { symbol: inst.symbol, order_index: prev.length }];
    });
  }, []);

  // Trade execution
  const handleTrade = async ({ side, orderType, qty, price, symbol }) => {
    if (!account) return;
    const total = qty * price;
    const fee = 0; // Configurable later

    if (side === 'buy') {
      // Update cash
      const newCash = account.current_cash - total - fee;
      await base44.entities.Account.update(account.id, { current_cash: newCash });

      // Update or create position
      const existingPos = positions.find(p => p.symbol === symbol);
      if (existingPos) {
        const newQty = existingPos.qty + qty;
        const newAvg = ((existingPos.avg_price * existingPos.qty) + (price * qty)) / newQty;
        await base44.entities.Position.update(existingPos.id, { qty: newQty, avg_price: newAvg });
      } else {
        await base44.entities.Position.create({ symbol, qty, avg_price: price, instrument_id: symbol });
      }

      // Record trade
      await base44.entities.Trade.create({
        symbol, side: 'buy', order_type: orderType, qty, price, fee, total,
        instrument_id: symbol,
      });

      toast.success(`Bought ${qty} ${symbol} @ $${price.toFixed(2)}`);
    } else {
      // Sell
      const existingPos = positions.find(p => p.symbol === symbol);
      if (!existingPos || existingPos.qty < qty) return;

      const realizedPnl = (price - existingPos.avg_price) * qty;
      const newCash = account.current_cash + total - fee;
      await base44.entities.Account.update(account.id, { current_cash: newCash });

      const newQty = existingPos.qty - qty;
      if (newQty <= 0) {
        await base44.entities.Position.delete(existingPos.id);
      } else {
        await base44.entities.Position.update(existingPos.id, { qty: newQty });
      }

      await base44.entities.Trade.create({
        symbol, side: 'sell', order_type: orderType, qty, price, fee, total,
        instrument_id: symbol, realized_pnl: realizedPnl,
      });

      toast.success(`Sold ${qty} ${symbol} @ $${price.toFixed(2)} | P&L: ${realizedPnl >= 0 ? '+' : ''}$${realizedPnl.toFixed(2)}`);
    }

    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    queryClient.invalidateQueries({ queryKey: ['positions'] });
    queryClient.invalidateQueries({ queryKey: ['trades'] });
  };

  const activeInstrument = DEFAULT_INSTRUMENTS.find(i => i.symbol === activeSymbol) || { symbol: activeSymbol, name: activeSymbol, type: 'stock' };

  return (
    <div className="flex flex-col h-screen bg-[#131722] overflow-hidden">
      {/* Disclaimer */}
      <div className="bg-[#2a2e39] px-3 py-1 flex items-center gap-2 text-[10px] text-[#787b86]">
        <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
        <span>Simulación educativa (Paper Trading). No es asesoría financiera. Los precios son simulados.</span>
      </div>

      <TopToolbar
        symbol={activeSymbol}
        symbolName={activeInstrument.name}
        instruments={DEFAULT_INSTRUMENTS}
        timeframe={timeframe}
        chartType={chartType}
        indicators={indicators}
        onSymbolChange={handleSymbolChange}
        onTimeframeChange={setTimeframe}
        onChartTypeChange={setChartType}
        onIndicatorsChange={setIndicators}
        priceData={priceData}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Chart area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0">
            <CandlestickChart
              candles={candles}
              chartType={chartType}
              indicators={indicators}
              currentPrice={priceData?.price}
              symbol={activeSymbol}
            />
          </div>
          <BottomPanel
            positions={positions}
            trades={trades}
            account={account}
            equitySnapshots={[]}
          />
        </div>

        {/* Right sidebar - Desktop */}
        <div className="hidden lg:flex flex-col w-64 border-l border-[#2a2e39] bg-[#131722]">
          <SymbolDetails
            symbol={activeSymbol}
            name={activeInstrument.name}
            type={activeInstrument.type}
            priceData={priceData}
            candles={candles}
          />
          <div className="flex-1 overflow-hidden">
            <Watchlist
              items={watchlistItems}
              instruments={DEFAULT_INSTRUMENTS}
              activeSymbol={activeSymbol}
              onSelectSymbol={handleSymbolChange}
              onReorder={handleReorder}
              onRemove={handleRemoveFromWatchlist}
              onAdd={handleAddToWatchlist}
            />
          </div>
          <TradePanel
            symbol={activeSymbol}
            currentPrice={priceData?.price}
            account={account}
            positions={positions}
            onTrade={handleTrade}
          />
        </div>

        {/* Mobile Watchlist Drawer */}
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <Sheet open={mobileWatchlist} onOpenChange={setMobileWatchlist}>
            <SheetTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full bg-[#2196F3] hover:bg-[#2196F3]/90 shadow-lg">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-[#131722] border-[#2a2e39]">
              <SymbolDetails
                symbol={activeSymbol}
                name={activeInstrument.name}
                type={activeInstrument.type}
                priceData={priceData}
                candles={candles}
              />
              <div className="h-64 overflow-hidden">
                <Watchlist
                  items={watchlistItems}
                  instruments={DEFAULT_INSTRUMENTS}
                  activeSymbol={activeSymbol}
                  onSelectSymbol={(sym) => { handleSymbolChange(sym); setMobileWatchlist(false); }}
                  onReorder={handleReorder}
                  onRemove={handleRemoveFromWatchlist}
                  onAdd={handleAddToWatchlist}
                />
              </div>
              <TradePanel
                symbol={activeSymbol}
                currentPrice={priceData?.price}
                account={account}
                positions={positions}
                onTrade={handleTrade}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}