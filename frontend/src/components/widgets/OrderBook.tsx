import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { useMarketStore } from '../../stores';
import { formatCurrency, formatNumber } from '../../utils';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBookData {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastPrice: number;
  spread: number;
  spreadPercentage: number;
}

// Mock order book data generator
const generateOrderBookData = (symbol: string, basePrice: number): OrderBookData => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  
  let bidTotal = 0;
  let askTotal = 0;
  
  // Generate bids (decreasing prices)
  for (let i = 0; i < 15; i++) {
    const price = basePrice - (i + 1) * (basePrice * 0.0001);
    const size = Math.random() * 10 + 0.1;
    bidTotal += size;
    bids.push({ price, size, total: bidTotal });
  }
  
  // Generate asks (increasing prices)
  for (let i = 0; i < 15; i++) {
    const price = basePrice + (i + 1) * (basePrice * 0.0001);
    const size = Math.random() * 10 + 0.1;
    askTotal += size;
    asks.push({ price, size, total: askTotal });
  }
  
  const spread = asks[0].price - bids[0].price;
  const spreadPercentage = (spread / basePrice) * 100;
  
  return {
    symbol,
    bids,
    asks,
    lastPrice: basePrice,
    spread,
    spreadPercentage
  };
};

export const OrderBook: React.FC = () => {
  const { selectedSymbol, marketData } = useMarketStore();
  const [orderBookData, setOrderBookData] = useState<OrderBookData | null>(null);
  const [precision, setPrecision] = useState(2);
  const [viewMode, setViewMode] = useState<'combined' | 'bids' | 'asks'>('combined');

  const basePrice = marketData[selectedSymbol]?.price || 52398;

  useEffect(() => {
    // Generate initial order book data
    const data = generateOrderBookData(selectedSymbol, basePrice);
    setOrderBookData(data);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const updatedData = generateOrderBookData(selectedSymbol, basePrice);
      setOrderBookData(updatedData);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSymbol, basePrice]);

  if (!orderBookData) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  const maxBidTotal = Math.max(...orderBookData.bids.map(b => b.total));
  const maxAskTotal = Math.max(...orderBookData.asks.map(a => a.total));
  const maxTotal = Math.max(maxBidTotal, maxAskTotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Order Book</h2>
          <span className="text-sm text-gray-400">({selectedSymbol})</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <select
            value={precision}
            onChange={(e) => setPrecision(Number(e.target.value))}
            className="px-3 py-1 text-xs bg-dark-700/50 border border-dark-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={0}>0</option>
            <option value={1}>0.0</option>
            <option value={2}>0.00</option>
            <option value={3}>0.000</option>
            <option value={4}>0.0000</option>
          </select>

          <div className="flex rounded-lg overflow-hidden">
            {(['combined', 'bids', 'asks'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50'
                }`}
              >
                {mode === 'combined' ? 'Both' : mode === 'bids' ? 'Bids' : 'Asks'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spread Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-dark-700/20 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-gray-400">Spread</p>
          <p className="text-sm font-medium text-white">
            {formatCurrency(orderBookData.spread)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Spread %</p>
          <p className="text-sm font-medium text-yellow-400">
            {orderBookData.spreadPercentage.toFixed(4)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Last Price</p>
          <p className="text-sm font-medium text-white">
            {formatCurrency(orderBookData.lastPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 px-2 py-1 text-xs font-medium text-gray-400 border-b border-dark-600/30">
          <div>Price ({orderBookData.symbol.split('/')[1] || 'USD'})</div>
          <div className="text-right">Size ({orderBookData.symbol.split('/')[0] || 'BTC'})</div>
          <div className="text-right">Total</div>
        </div>

        {/* Order Book Entries */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-transparent">
          {/* Asks (Sell Orders) */}
          {(viewMode === 'combined' || viewMode === 'asks') && (
            <div className="space-y-px">
              {orderBookData.asks.slice().reverse().map((ask, index) => (
                <motion.div
                  key={`ask-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  className="relative grid grid-cols-3 gap-4 px-2 py-1 text-xs hover:bg-red-500/10 transition-colors"
                >
                  {/* Background bar for volume visualization */}
                  <div
                    className="absolute inset-y-0 right-0 bg-red-500/20 transition-all duration-300"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  />
                  
                  <div className="relative z-10 text-red-400 font-mono">
                    {ask.price.toFixed(precision)}
                  </div>
                  <div className="relative z-10 text-right text-white font-mono">
                    {formatNumber(ask.size)}
                  </div>
                  <div className="relative z-10 text-right text-gray-400 font-mono">
                    {formatNumber(ask.total)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Spread Indicator */}
          {viewMode === 'combined' && (
            <div className="flex items-center justify-center py-2 my-2 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded">
              <Activity className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-xs text-yellow-400 font-medium">
                Spread: {formatCurrency(orderBookData.spread)} ({orderBookData.spreadPercentage.toFixed(4)}%)
              </span>
            </div>
          )}

          {/* Bids (Buy Orders) */}
          {(viewMode === 'combined' || viewMode === 'bids') && (
            <div className="space-y-px">
              {orderBookData.bids.map((bid, index) => (
                <motion.div
                  key={`bid-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  className="relative grid grid-cols-3 gap-4 px-2 py-1 text-xs hover:bg-green-500/10 transition-colors"
                >
                  {/* Background bar for volume visualization */}
                  <div
                    className="absolute inset-y-0 right-0 bg-green-500/20 transition-all duration-300"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  />
                  
                  <div className="relative z-10 text-green-400 font-mono">
                    {bid.price.toFixed(precision)}
                  </div>
                  <div className="relative z-10 text-right text-white font-mono">
                    {formatNumber(bid.size)}
                  </div>
                  <div className="relative z-10 text-right text-gray-400 font-mono">
                    {formatNumber(bid.total)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-dark-600/30">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ArrowUp className="w-3 h-3 text-green-400" />
            <span className="text-gray-400">Best Bid:</span>
            <span className="text-green-400 font-mono">
              {orderBookData.bids[0]?.price.toFixed(precision)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDown className="w-3 h-3 text-red-400" />
            <span className="text-gray-400">Best Ask:</span>
            <span className="text-red-400 font-mono">
              {orderBookData.asks[0]?.price.toFixed(precision)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
