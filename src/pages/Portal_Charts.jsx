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
import { List, AlertTriangle, FlaskConical, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import MarketSignals from '../components/trading/MarketSignals';

const DEFAULT_INSTRUMENTS = [
  // ── Acciones ──────────────────────────────────────────────────────
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock' },
  { symbol: 'META', name: 'Meta Platforms', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)', type: 'stock' },
  { symbol: 'NFLX', name: 'Netflix', type: 'stock' },
  { symbol: 'AMD', name: 'AMD', type: 'stock' },
  { symbol: 'INTC', name: 'Intel', type: 'stock' },
  { symbol: 'CRM', name: 'Salesforce', type: 'stock' },
  { symbol: 'ORCL', name: 'Oracle', type: 'stock' },
  { symbol: 'ADBE', name: 'Adobe', type: 'stock' },
  { symbol: 'JPM', name: 'JPMorgan Chase', type: 'stock' },
  { symbol: 'GS', name: 'Goldman Sachs', type: 'stock' },
  { symbol: 'BAC', name: 'Bank of America', type: 'stock' },
  { symbol: 'WFC', name: 'Wells Fargo', type: 'stock' },
  { symbol: 'WMT', name: 'Walmart', type: 'stock' },
  { symbol: 'PG', name: 'Procter & Gamble', type: 'stock' },
  { symbol: 'KO', name: 'Coca-Cola', type: 'stock' },
  { symbol: 'XOM', name: 'ExxonMobil', type: 'stock' },
  { symbol: 'CVX', name: 'Chevron', type: 'stock' },
  { symbol: 'V', name: 'Visa', type: 'stock' },
  { symbol: 'MA', name: 'Mastercard', type: 'stock' },
  { symbol: 'PYPL', name: 'PayPal', type: 'stock' },
  { symbol: 'COIN', name: 'Coinbase', type: 'stock' },
  { symbol: 'HOOD', name: 'Robinhood', type: 'stock' },
  { symbol: 'SQ', name: 'Block (Square)', type: 'stock' },
  { symbol: 'UBER', name: 'Uber', type: 'stock' },
  { symbol: 'ABNB', name: 'Airbnb', type: 'stock' },
  { symbol: 'SPOT', name: 'Spotify', type: 'stock' },
  { symbol: 'PLTR', name: 'Palantir', type: 'stock' },
  { symbol: 'BABA', name: 'Alibaba', type: 'stock' },
  { symbol: 'TSM', name: 'TSMC', type: 'stock' },
  { symbol: 'ASML', name: 'ASML', type: 'stock' },
  // ── ETFs ──────────────────────────────────────────────────────────
  { symbol: 'SPY', name: 'SPDR S&P 500', type: 'etf' },
  { symbol: 'QQQ', name: 'Invesco QQQ', type: 'etf' },
  { symbol: 'IWM', name: 'iShares Russell 2000', type: 'etf' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'etf' },
  { symbol: 'SLV', name: 'iShares Silver Trust', type: 'etf' },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', type: 'etf' },
  { symbol: 'IBIT', name: 'iShares Bitcoin Trust', type: 'etf' },
  { symbol: 'BITO', name: 'ProShares Bitcoin ETF', type: 'etf' },
  { symbol: 'XLF', name: 'Financial Select ETF', type: 'etf' },
  { symbol: 'XLE', name: 'Energy Select ETF', type: 'etf' },
  { symbol: 'XLK', name: 'Technology Select ETF', type: 'etf' },
  { symbol: 'TLT', name: 'iShares 20Y Treasury', type: 'etf' },
  { symbol: 'LQD', name: 'iShares Corp Bond', type: 'etf' },
  // ── Índices ───────────────────────────────────────────────────────
  { symbol: 'SPX500', name: 'S&P 500', type: 'etf' },
  { symbol: 'US30', name: 'Dow Jones', type: 'etf' },
  { symbol: 'NAS100', name: 'NASDAQ 100', type: 'etf' },
  { symbol: 'RUT2000', name: 'Russell 2000', type: 'etf' },
  { symbol: 'VIXUSD', name: 'VIX', type: 'etf' },
  { symbol: 'GER40', name: 'DAX 40', type: 'etf' },
  { symbol: 'UK100', name: 'FTSE 100', type: 'etf' },
  { symbol: 'FRA40', name: 'CAC 40', type: 'etf' },
  { symbol: 'ESP35', name: 'IBEX 35', type: 'etf' },
  { symbol: 'EU50', name: 'Euro Stoxx 50', type: 'etf' },
  { symbol: 'JPN225', name: 'Nikkei 225', type: 'etf' },
  { symbol: 'HK50', name: 'Hang Seng', type: 'etf' },
  { symbol: 'AUS200', name: 'ASX 200', type: 'etf' },
  { symbol: 'IND50', name: 'NIFTY 50', type: 'etf' },
  // ── Crypto ────────────────────────────────────────────────────────
  { symbol: 'BTCUSD', name: 'Bitcoin / USD', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum / USD', type: 'crypto' },
  { symbol: 'BNBUSD', name: 'BNB / USD', type: 'crypto' },
  { symbol: 'SOLUSD', name: 'Solana / USD', type: 'crypto' },
  { symbol: 'XRPUSD', name: 'XRP / USD', type: 'crypto' },
  { symbol: 'ADAUSD', name: 'Cardano / USD', type: 'crypto' },
  { symbol: 'AVAXUSD', name: 'Avalanche / USD', type: 'crypto' },
  { symbol: 'DOTUSD', name: 'Polkadot / USD', type: 'crypto' },
  { symbol: 'MATICUSD', name: 'Polygon / USD', type: 'crypto' },
  { symbol: 'LINKUSD', name: 'Chainlink / USD', type: 'crypto' },
  { symbol: 'UNIUSD', name: 'Uniswap / USD', type: 'crypto' },
  { symbol: 'ARBUSD', name: 'Arbitrum / USD', type: 'crypto' },
  { symbol: 'OPUSD', name: 'Optimism / USD', type: 'crypto' },
  { symbol: 'DOGEUSD', name: 'Dogecoin / USD', type: 'crypto' },
  { symbol: 'SHIBUSD', name: 'Shiba Inu / USD', type: 'crypto' },
  { symbol: 'PEPEUSD', name: 'Pepe / USD', type: 'crypto' },
  { symbol: 'SUIUSD', name: 'Sui / USD', type: 'crypto' },
  { symbol: 'APTUSD', name: 'Aptos / USD', type: 'crypto' },
  { symbol: 'NEARUSD', name: 'NEAR Protocol / USD', type: 'crypto' },
  { symbol: 'TONUSD', name: 'Toncoin / USD', type: 'crypto' },
  { symbol: 'ATOMUSD', name: 'Cosmos / USD', type: 'crypto' },
  { symbol: 'LTCUSD', name: 'Litecoin / USD', type: 'crypto' },
  { symbol: 'TRXUSD', name: 'TRON / USD', type: 'crypto' },
  { symbol: 'FTMUSD', name: 'Fantom / USD', type: 'crypto' },
  { symbol: 'INJUSD', name: 'Injective / USD', type: 'crypto' },
  { symbol: 'MKRUSD', name: 'Maker / USD', type: 'crypto' },
  { symbol: 'AAVEUSD', name: 'Aave / USD', type: 'crypto' },
  { symbol: 'RNDUSD', name: 'Render / USD', type: 'crypto' },
  { symbol: 'JUPUSD', name: 'Jupiter / USD', type: 'crypto' },
  // ── Forex Mayores ─────────────────────────────────────────────────
  { symbol: 'EURUSD', name: 'EUR / USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP / USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'USD / JPY', type: 'forex' },
  { symbol: 'AUDUSD', name: 'AUD / USD', type: 'forex' },
  { symbol: 'USDCAD', name: 'USD / CAD', type: 'forex' },
  { symbol: 'USDCHF', name: 'USD / CHF', type: 'forex' },
  { symbol: 'NZDUSD', name: 'NZD / USD', type: 'forex' },
  // ── Forex Cruces ──────────────────────────────────────────────────
  { symbol: 'EURGBP', name: 'EUR / GBP', type: 'forex' },
  { symbol: 'EURJPY', name: 'EUR / JPY', type: 'forex' },
  { symbol: 'GBPJPY', name: 'GBP / JPY', type: 'forex' },
  { symbol: 'AUDJPY', name: 'AUD / JPY', type: 'forex' },
  { symbol: 'EURAUD', name: 'EUR / AUD', type: 'forex' },
  { symbol: 'EURCHF', name: 'EUR / CHF', type: 'forex' },
  { symbol: 'GBPAUD', name: 'GBP / AUD', type: 'forex' },
  { symbol: 'GBPCHF', name: 'GBP / CHF', type: 'forex' },
  { symbol: 'CHFJPY', name: 'CHF / JPY', type: 'forex' },
  { symbol: 'AUDNZD', name: 'AUD / NZD', type: 'forex' },
  { symbol: 'EURCAD', name: 'EUR / CAD', type: 'forex' },
  // ── Forex LatAm ───────────────────────────────────────────────────
  { symbol: 'USDMXN', name: 'USD / MXN', type: 'forex' },
  { symbol: 'USDBRL', name: 'USD / BRL', type: 'forex' },
  { symbol: 'USDCOP', name: 'USD / COP', type: 'forex' },
  { symbol: 'USDCLP', name: 'USD / CLP', type: 'forex' },
  { symbol: 'USDARS', name: 'USD / ARS', type: 'forex' },
  // ── Forex Emergentes ──────────────────────────────────────────────
  { symbol: 'USDINR', name: 'USD / INR', type: 'forex' },
  { symbol: 'USDCNY', name: 'USD / CNY', type: 'forex' },
  { symbol: 'USDZAR', name: 'USD / ZAR', type: 'forex' },
  { symbol: 'USDTRY', name: 'USD / TRY', type: 'forex' },
  { symbol: 'USDHKD', name: 'USD / HKD', type: 'forex' },
  { symbol: 'USDSGD', name: 'USD / SGD', type: 'forex' },
  { symbol: 'USDNOK', name: 'USD / NOK', type: 'forex' },
  { symbol: 'USDSEK', name: 'USD / SEK', type: 'forex' },
  // ── Metales Preciosos ─────────────────────────────────────────────
  { symbol: 'XAUUSD', name: 'Oro / USD', type: 'forex' },
  { symbol: 'XAGUSD', name: 'Plata / USD', type: 'forex' },
  { symbol: 'XPTUSD', name: 'Platino / USD', type: 'forex' },
  { symbol: 'XPDUSD', name: 'Paladio / USD', type: 'forex' },
  // ── Energía ───────────────────────────────────────────────────────
  { symbol: 'WTIUSD', name: 'WTI Crudo / USD', type: 'forex' },
  { symbol: 'BRTUSD', name: 'Brent Crudo / USD', type: 'forex' },
  { symbol: 'NATGASUSD', name: 'Gas Natural / USD', type: 'forex' },
  // ── Agrícolas ─────────────────────────────────────────────────────
  { symbol: 'WHTUSD', name: 'Trigo / USD', type: 'forex' },
  { symbol: 'CORNUSD', name: 'Maíz / USD', type: 'forex' },
  { symbol: 'SOYUSD', name: 'Soya / USD', type: 'forex' },
  { symbol: 'COFUSD', name: 'Café / USD', type: 'forex' },
  { symbol: 'SUGUSD', name: 'Azúcar / USD', type: 'forex' },
  { symbol: 'CTTUSD', name: 'Algodón / USD', type: 'forex' },
  { symbol: 'CACUSD', name: 'Cacao / USD', type: 'forex' },
  // ── Metales Industriales ──────────────────────────────────────────
  { symbol: 'COPUSD', name: 'Cobre / USD', type: 'forex' },
  { symbol: 'ALMUSD', name: 'Aluminio / USD', type: 'forex' },
  { symbol: 'NICUSD', name: 'Níquel / USD', type: 'forex' },
  { symbol: 'ZNUSD', name: 'Zinc / USD', type: 'forex' },
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
  const [rightPanel, setRightPanel] = useState('watchlist'); // 'watchlist' | 'signals'
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
    if (!activeAccount) { toast.error('Sin cuenta activa'); return; }
    const total = qty * price;
    const fee = 0;

    if (side === 'buy') {
      if (activeAccount.cash_balance < total) { toast.error('Fondos insuficientes'); return; }
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
      toast.success(`Comprado ${qty} ${symbol} @ $${price.toFixed(2)}`);
    } else {
      const existingPos = positions.find(p => p.symbol === symbol);
      if (!existingPos || existingPos.qty < qty) { toast.error('Posición insuficiente'); return; }
      const realizedPnl = (price - existingPos.avg_price) * qty;
      const newCash = activeAccount.cash_balance + total - fee;
      await base44.entities.BrokerAccount.update(activeAccount.id, { cash_balance: newCash });
      const newQty = existingPos.qty - qty;
      if (newQty <= 0) await base44.entities.BrokerPosition.delete(existingPos.id);
      else await base44.entities.BrokerPosition.update(existingPos.id, { qty: newQty });
      await base44.entities.BrokerTrade.create({ account_id: activeAccount.id, account_type: activeType, user_id: activeAccount.user_id, symbol, side: 'sell', order_type: orderType, qty, price, fee, total, realized_pnl: realizedPnl, instrument_name: DEFAULT_INSTRUMENTS.find(i => i.symbol === symbol)?.name || symbol });
      toast.success(`Vendido ${qty} ${symbol} | G/P: ${realizedPnl >= 0 ? '+' : ''}$${realizedPnl.toFixed(2)}`);
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
        <span>{activeType === 'DEMO' ? 'MODO DEMO — Operaciones simuladas con fondos virtuales. Los precios son simulados.' : 'CUENTA REAL — Simulador de trading. No se ejecutan órdenes reales.'}</span>
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
          {/* Panel tab toggle */}
          <div className="flex border-b border-[#2a2e39] flex-shrink-0">
            <button
              onClick={() => setRightPanel('watchlist')}
              className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${rightPanel === 'watchlist' ? 'text-white bg-[#1e222d]' : 'text-[#787b86] hover:text-white'}`}
            >
              <List className="h-3 w-3 inline mr-1" />Lista
            </button>
            <button
              onClick={() => setRightPanel('signals')}
              className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${rightPanel === 'signals' ? 'text-[#2196F3] bg-[#2196F3]/10' : 'text-[#787b86] hover:text-white'}`}
            >
              <Zap className="h-3 w-3 inline mr-1" />Señales
              {activeType === 'DEMO' && <span className="ml-1 text-[8px] bg-[#2196F3]/20 text-[#2196F3] px-1 rounded">REAL</span>}
            </button>
          </div>

          {rightPanel === 'watchlist' ? (
            <>
              <SymbolDetails symbol={activeSymbol} name={activeInstrument.name} type={activeInstrument.type} priceData={priceData} candles={candles} />
              <div className="flex-1 overflow-hidden">
                <Watchlist items={watchlistItems} instruments={DEFAULT_INSTRUMENTS} activeSymbol={activeSymbol}
                  onSelectSymbol={handleSymbolChange} onReorder={handleReorder}
                  onRemove={s => setWatchlistItems(p => p.filter(i => i.symbol !== s))}
                  onAdd={inst => setWatchlistItems(p => p.find(i => i.symbol === inst.symbol) ? p : [...p, { symbol: inst.symbol, order_index: p.length }])}
                />
              </div>
              <TradePanel symbol={activeSymbol} currentPrice={priceData?.price} account={accountForPanel} positions={positionsForPanel} onTrade={handleTrade} />
            </>
          ) : (
            <div className="flex-1 overflow-hidden">
              <MarketSignals isRealAccount={activeType === 'REAL'} onSelectSymbol={handleSymbolChange} />
            </div>
          )}
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