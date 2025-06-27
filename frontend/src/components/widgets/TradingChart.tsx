import { useState } from 'react';
import { ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';

const timeframes = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
];

// Mock candlestick data
const generateMockData = () => {
  const data = [];
  let price = 45000;
  
  for (let i = 0; i < 50; i++) {
    const open = price;
    const change = (Math.random() - 0.5) * 1000;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 500;
    const low = Math.min(open, close) - Math.random() * 500;
    
    data.push({
      time: Date.now() - (49 - i) * 3600000,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000
    });
    
    price = close;
  }
  
  return data;
};

export function TradingChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [chartType, setChartType] = useState('candlestick');
  
  const data = generateMockData();
  const currentPrice = data[data.length - 1]?.close || 45000;
  const priceChange = data.length > 1 ? currentPrice - data[data.length - 2].close : 0;
  const priceChangePercent = data.length > 1 ? (priceChange / data[data.length - 2].close) * 100 : 0;

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="p-4 border-b border-secondary-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">BTC/USD</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-white">
                ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          {/* Time Frame Selector */}
          <div className="flex items-center space-x-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedTimeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-secondary-800'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-96 p-4">
        <div className="w-full h-full bg-secondary-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Mock Chart Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="stroke-blue-400">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="1" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Mock Candlestick Chart */}
          <div className="relative w-full h-full flex items-end justify-between px-4 pb-4">
            {data.slice(-20).map((candle, index) => {
              const isGreen = candle.close > candle.open;
              const bodyHeight = Math.abs(candle.close - candle.open) / 50;
              const wickTop = (candle.high - Math.max(candle.open, candle.close)) / 50;
              const wickBottom = (Math.min(candle.open, candle.close) - candle.low) / 50;
              
              return (
                <div key={index} className="flex flex-col items-center" style={{ width: '4%' }}>
                  {/* Upper Wick */}
                  <div 
                    className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ height: `${wickTop * 2}px` }}
                  />
                  {/* Body */}
                  <div 
                    className={`w-full ${isGreen ? 'bg-green-400' : 'bg-red-400'} opacity-80`}
                    style={{ height: `${Math.max(bodyHeight * 2, 2)}px` }}
                  />
                  {/* Lower Wick */}
                  <div 
                    className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ height: `${wickBottom * 2}px` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Overlay Info */}
          <div className="absolute top-4 left-4 glass-card p-3 space-y-1">
            <div className="text-xs text-gray-400">OHLC</div>
            <div className="text-sm text-white">
              O: ${data[data.length - 1]?.open.toFixed(2)} | 
              H: ${data[data.length - 1]?.high.toFixed(2)} | 
              L: ${data[data.length - 1]?.low.toFixed(2)} | 
              C: ${data[data.length - 1]?.close.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              Vol: {(data[data.length - 1]?.volume / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="p-4 border-t border-secondary-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Chart Type:</span>
              <select 
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="bg-secondary-800 border border-secondary-700 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="candlestick">Candlestick</option>
                <option value="line">Line</option>
                <option value="area">Area</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Indicators:</span>
              <button className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-xs text-blue-400">
                RSI
              </button>
              <button className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded text-xs text-green-400">
                MACD
              </button>
              <button className="px-2 py-1 border border-secondary-600 rounded text-xs text-gray-400 hover:text-white">
                + Add
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
