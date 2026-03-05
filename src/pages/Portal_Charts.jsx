import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { List, AlertTriangle, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';

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

function ChartsContent() {
  const { activeAccount, activeType } = useAccount();
  const urlParams = new URLSearchParams(window.location.search);
  const [activeSymbol, setActiveSymbol] = useState(urlParams.get('symbol') || 'AAPL');
  const [timeframe, setTimeframe] = useState('5');
  const [chartType, setChartType] = useState('candles');
  const [indicators, setIndicators] = useState(['SMA20']);
  const [candles, setCandles] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [watchlistItems, setWatchlistItems] = useState([
    { symbol: 'AAPL', order_index: 0 }, { symbol: 'MSFT', order_index: 1 },
    { symbol: 'TSLA', order_index: 2 }, { symbol: 'SPY', order_index: 3 },
    { symbol: 'BTCUSD', order_index: 4 },
  ]);
  const [mobileWatchlist, setMobileWatchlist] = useState(false);
  const queryClient = useQueryClient();

  const { data: positions = [] } = useQuery({
    queryKey: ['broker-positions', activeAccount?.id],
    queryFn: () => base44.entities.BrokerPosition.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['broker-trades-recent', activeAccount?.id],
    queryFn: () => base44.entities.BrokerTrade.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  useEffect(() => {
    const data = priceEngine.generateCandles(activeSymbol, timeframe, 150);
    setCandles(data);
  }, [activeSymbol, timeframe]);

  useEffect(() => {
    const unsub = priceEngine.subscribe(activeSymbol, (data) => {
      setPriceData(data);
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        last.close = data.price; last.high = Math.max(last.high, data.price); last.low = Math.min(last.low, data.price);
        return [...prev.slice(0, -1), last];
      });
    });
    return unsub;
  }, [activeSymbol]);

  const handleSymbolChange = useCallback((symbol) => { setActiveSymbol(symbol); setPriceData(null); }, []);
  const handleReorder = useCallback((from, to) => {
    setWatchlistItems(prev => {
      const items = [...prev]; const [removed] = items.splice(from, 1); items.splice(to, 0, removed);
      return items.map((item, i) => ({ ...item, order_index: i }));
    });
  }, []);

  const handleTrade = async ({ side, orderType, qty, price, symbol }) => {
    if (!activeAccount) { toast.error('No active account'); return; }
    const total = qty * price;
    const fee = 0;

    if (side === 'buy') {
      if (activeAccount.cash_balance < total) { toast.error('Insufficient funds'); return; }
      const newCash = activeAccount.cash_balance - total - fee;
      await base44.entities.BrokerAccount.update(activeAccount.id, { cash_balance: newCash });
      const existingPos = positions.find(p => p.symbol === symbol);
      if (existingPos) {
        const newQty = existingPos.qty + qty;
        const newAvg = ((existingPos.avg_price * existingPos.qty) + (price * qty)) / newQty;
        await base44.entities.BrokerPosition.update(existingPos.id, { qty: newQty, avg_price: newAvg });
      } else {
        await base44.entities.BrokerPosition.create({ account_id: activeAccount.id, account_type: activeType, user_id: activeAccount.user_id, symbol, qty, avg_price: price, instrument_name: DEFAULT_INSTRUMENTS.find(i => i.symbol === symbol)?.name || symbol });
      }
      await base44.entities.BrokerTrade.create({ account_id: activeAccount.id, account_type: activeType, user_id: activeAccount.user_id, symbol, side: 'buy', order_type: orderType, qty, price, fee, total, instrument_name: DEFAULT_INSTRUMENTS.find(i => i.symbol === symbol)?.name || symbol });
      toast.success(`Bought ${qty} ${symbol} @ $${price.toFixed(2)}`);
    } else {
      const existingPos = positions.find(p => p.symbol === symbol);
      if (!existingPos || existingPos.qty < qty) { toast.error('Insufficient position'); return; }
      const realizedPnl = (price - existingPos.avg_price) * qty;
      const newCash = activeAccount.cash_balance + total - fee;
      await base44.entities.BrokerAccount.update(activeAccount.id, { cash_balance: newCash });
      const newQty = existingPos.qty - qty;
      if (newQty <= 0) await base44.entities.BrokerPosition.delete(existingPos.id);
      else await base44.entities.BrokerPosition.update(existingPos.id, { qty: newQty });
      await base44.entities.BrokerTrade.create({ account_id: activeAccount.id, account_type: activeType, user_id: activeAccount.user_id, symbol, side: 'sell', order_type: orderType, qty, price, fee, total, realized_pnl: realizedPnl, instrument_name: DEFAULT_INSTRUMENTS.find(i => i.symbol === symbol)?.name || symbol });
      toast.success(`Sold ${qty} ${symbol} | P&L: ${realizedPnl >= 0 ? '+' : ''}$${realizedPnl.toFixed(2)}`);
    }
    queryClient.invalidateQueries({ queryKey: ['broker-positions', activeAccount.id] });
    queryClient.invalidateQueries({ queryKey: ['broker-trades-recent', activeAccount.id] });
    queryClient.invalidateQueries({ queryKey: ['broker-accounts'] });
  };

  // Adapt positions and account format for existing components
  const positionsForPanel = positions.map(p => ({ ...p, id: p.id }));
  const accountForPanel = activeAccount ? { ...activeAccount, current_cash: activeAccount.cash_balance } : null;

  const activeInstrument = DEFAULT_INSTRUMENTS.find(i => i.symbol === activeSymbol) || { symbol: activeSymbol, name: activeSymbol, type: 'stock' };

  return (
    <div className="flex flex-col h-full bg-[#131722] overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Account type badge */}
      <div className={`px-3 py-1 flex items-center gap-2 text-[10px] ${activeType === 'DEMO' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#1e2130] text-[#787b86]'}`}>
        <FlaskConical className="h-3 w-3 flex-shrink-0" />
        <span>{activeType === 'DEMO' ? 'DEMO MODE — Paper trading with virtual funds. Prices are simulated.' : 'REAL ACCOUNT — Paper Trading Simulator. No real orders are executed.'}</span>
      </div>

      <TopToolbar
        symbol={activeSymbol} symbolName={activeInstrument.name} instruments={DEFAULT_INSTRUMENTS}
        timeframe={timeframe} chartType={chartType} indicators={indicators}
        onSymbolChange={handleSymbolChange} onTimeframeChange={setTimeframe}
        onChartTypeChange={setChartType} onIndicatorsChange={setIndicators} priceData={priceData}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0">
            <CandlestickChart candles={candles} chartType={chartType} indicators={indicators} currentPrice={priceData?.price} symbol={activeSymbol} />
          </div>
          <BottomPanel positions={positionsForPanel} trades={trades} account={accountForPanel} equitySnapshots={[]} />
        </div>

        <div className="hidden lg:flex flex-col w-64 border-l border-[#2a2e39] bg-[#131722]">
          <SymbolDetails symbol={activeSymbol} name={activeInstrument.name} type={activeInstrument.type} priceData={priceData} candles={candles} />
          <div className="flex-1 overflow-hidden">
            <Watchlist items={watchlistItems} instruments={DEFAULT_INSTRUMENTS} activeSymbol={activeSymbol}
              onSelectSymbol={handleSymbolChange} onReorder={handleReorder}
              onRemove={s => setWatchlistItems(p => p.filter(i => i.symbol !== s))}
              onAdd={inst => setWatchlistItems(p => p.find(i => i.symbol === inst.symbol) ? p : [...p, { symbol: inst.symbol, order_index: p.length }])}
            />
          </div>
          <TradePanel symbol={activeSymbol} currentPrice={priceData?.price} account={accountForPanel} positions={positionsForPanel} onTrade={handleTrade} />
        </div>

        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <Sheet open={mobileWatchlist} onOpenChange={setMobileWatchlist}>
            <SheetTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full bg-[#2196F3] shadow-lg">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-[#131722] border-[#2a2e39]">
              <SymbolDetails symbol={activeSymbol} name={activeInstrument.name} type={activeInstrument.type} priceData={priceData} candles={candles} />
              <div className="h-64 overflow-hidden">
                <Watchlist items={watchlistItems} instruments={DEFAULT_INSTRUMENTS} activeSymbol={activeSymbol}
                  onSelectSymbol={s => { handleSymbolChange(s); setMobileWatchlist(false); }}
                  onReorder={handleReorder}
                  onRemove={s => setWatchlistItems(p => p.filter(i => i.symbol !== s))}
                  onAdd={inst => setWatchlistItems(p => p.find(i => i.symbol === inst.symbol) ? p : [...p, { symbol: inst.symbol, order_index: p.length }])}
                />
              </div>
              <TradePanel symbol={activeSymbol} currentPrice={priceData?.price} account={accountForPanel} positions={positionsForPanel} onTrade={handleTrade} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default function PortalChartsPage() {
  return (
    <PortalLayout currentPageName="Portal_Charts">
      <ChartsContent />
    </PortalLayout>
  );
}