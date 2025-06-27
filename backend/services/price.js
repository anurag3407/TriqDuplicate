const axios = require('axios');

class PriceService {
  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY || '';
    this.baseUrl = 'https://api.coingecko.com/api/v3';
    this.cache = new Map();
    this.cacheTimeout = 30 * 1000; // 30 seconds
    this.subscribers = new Map(); // Map<symbol, Set<callback>>
  }

  // Get current prices for multiple symbols
  async getCurrentPrices(symbols) {
    try {
      const cacheKey = `prices_${symbols.join(',')}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Map symbols to CoinGecko IDs
      const coinGeckoIds = this.mapSymbolsToCoinGeckoIds(symbols);
      
      // In production, use actual CoinGecko API
      // const response = await axios.get(`${this.baseUrl}/simple/price`, {
      //   params: {
      //     ids: coinGeckoIds.join(','),
      //     vs_currencies: 'usd',
      //     include_24hr_change: true,
      //     include_24hr_vol: true,
      //     include_market_cap: true
      //   }
      // });

      // Mock price data for development
      const prices = this.generateMockPrices(symbols);
      
      this.setCache(cacheKey, prices);
      return prices;
    } catch (error) {
      console.error('Price fetch error:', error);
      throw new Error('Failed to fetch current prices');
    }
  }

  // Get historical price data
  async getHistoricalPrices(symbol, days = 30, interval = 'daily') {
    try {
      const cacheKey = `historical_${symbol}_${days}_${interval}`;
      const cached = this.getFromCache(cacheKey, 5 * 60 * 1000); // 5 minute cache
      if (cached) return cached;

      // Mock historical data - replace with actual API call
      const historicalData = this.generateMockHistoricalData(symbol, days);
      
      this.setCache(cacheKey, historicalData, 5 * 60 * 1000);
      return historicalData;
    } catch (error) {
      console.error('Historical price fetch error:', error);
      throw new Error('Failed to fetch historical prices');
    }
  }

  // Get detailed market data for a symbol
  async getMarketData(symbol) {
    try {
      const cacheKey = `market_${symbol}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Mock market data - replace with actual API call
      const marketData = this.generateMockMarketData(symbol);
      
      this.setCache(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Market data fetch error:', error);
      throw new Error('Failed to fetch market data');
    }
  }

  // Get trending cryptocurrencies
  async getTrendingCoins() {
    try {
      const cacheKey = 'trending_coins';
      const cached = this.getFromCache(cacheKey, 10 * 60 * 1000); // 10 minute cache
      if (cached) return cached;

      // Mock trending data - replace with actual API call
      const trending = [
        { symbol: 'BTC', name: 'Bitcoin', change24h: 3.2, volume: 28500000000 },
        { symbol: 'ETH', name: 'Ethereum', change24h: -1.5, volume: 12500000000 },
        { symbol: 'SOL', name: 'Solana', change24h: 8.7, volume: 2800000000 },
        { symbol: 'ADA', name: 'Cardano', change24h: 5.2, volume: 850000000 },
        { symbol: 'DOT', name: 'Polkadot', change24h: -2.8, volume: 420000000 }
      ];

      this.setCache(cacheKey, trending, 10 * 60 * 1000);
      return trending;
    } catch (error) {
      console.error('Trending coins fetch error:', error);
      throw new Error('Failed to fetch trending coins');
    }
  }

  // Subscribe to price updates
  subscribeToPriceUpdates(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol).add(callback);
    
    console.log(`Subscribed to price updates for ${symbol}`);
  }

  // Unsubscribe from price updates
  unsubscribeFromPriceUpdates(symbol, callback) {
    if (this.subscribers.has(symbol)) {
      this.subscribers.get(symbol).delete(callback);
      
      // Clean up empty subscriptions
      if (this.subscribers.get(symbol).size === 0) {
        this.subscribers.delete(symbol);
      }
    }
  }

  // Start price streaming (mock implementation)
  startPriceStreaming() {
    setInterval(async () => {
      for (const [symbol, callbacks] of this.subscribers.entries()) {
        try {
          const priceData = await this.getCurrentPrices([symbol]);
          const symbolData = priceData[symbol];
          
          callbacks.forEach(callback => {
            try {
              callback(symbol, symbolData);
            } catch (error) {
              console.error('Price update callback error:', error);
            }
          });
        } catch (error) {
          console.error(`Price streaming error for ${symbol}:`, error);
        }
      }
    }, 2000); // Update every 2 seconds
  }

  // Calculate technical indicators
  calculateTechnicalIndicators(prices, period = 14) {
    const indicators = {};
    
    // RSI (Relative Strength Index)
    indicators.rsi = this.calculateRSI(prices, period);
    
    // Moving Averages
    indicators.sma20 = this.calculateSMA(prices, 20);
    indicators.sma50 = this.calculateSMA(prices, 50);
    indicators.ema12 = this.calculateEMA(prices, 12);
    indicators.ema26 = this.calculateEMA(prices, 26);
    
    // MACD
    indicators.macd = this.calculateMACD(prices);
    
    // Bollinger Bands
    indicators.bollingerBands = this.calculateBollingerBands(prices, 20, 2);
    
    return indicators;
  }

  // Helper methods for mock data generation
  generateMockPrices(symbols) {
    const basePrices = {
      BTC: 35000,
      ETH: 1650,
      SOL: 105,
      ADA: 0.45,
      DOT: 6.20,
      MATIC: 0.85,
      LINK: 12.50,
      UNI: 8.30
    };

    const prices = {};
    symbols.forEach(symbol => {
      const basePrice = basePrices[symbol] || 1.0;
      const change = (Math.random() - 0.5) * 0.1; // ±5% random change
      
      prices[symbol] = {
        price: Number((basePrice * (1 + change)).toFixed(symbol === 'ADA' ? 4 : 2)),
        change24h: (Math.random() - 0.5) * 10, // ±5% daily change
        changePercent24h: (Math.random() - 0.5) * 10,
        volume24h: Math.floor(Math.random() * 1000000000),
        marketCap: Math.floor(Math.random() * 100000000000),
        high24h: basePrice * (1 + Math.random() * 0.05),
        low24h: basePrice * (1 - Math.random() * 0.05),
        lastUpdated: new Date()
      };
    });

    return prices;
  }

  generateMockHistoricalData(symbol, days) {
    const data = [];
    const basePrice = 35000; // Mock base price
    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const change = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
      currentPrice *= (1 + change);
      
      data.push({
        timestamp: date.getTime(),
        date: date.toISOString().split('T')[0],
        price: Number(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 50000000000),
        high: currentPrice * (1 + Math.random() * 0.03),
        low: currentPrice * (1 - Math.random() * 0.03),
        open: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
        close: currentPrice
      });
    }

    return data;
  }

  generateMockMarketData(symbol) {
    const basePrice = 35000;
    return {
      symbol,
      name: this.getSymbolName(symbol),
      price: basePrice + (Math.random() - 0.5) * 1000,
      marketCap: Math.floor(Math.random() * 1000000000000),
      volume24h: Math.floor(Math.random() * 50000000000),
      circulatingSupply: Math.floor(Math.random() * 100000000),
      totalSupply: Math.floor(Math.random() * 120000000),
      maxSupply: Math.floor(Math.random() * 21000000),
      change1h: (Math.random() - 0.5) * 2,
      change24h: (Math.random() - 0.5) * 10,
      change7d: (Math.random() - 0.5) * 20,
      change30d: (Math.random() - 0.5) * 40,
      ath: basePrice * (1 + Math.random()),
      atl: basePrice * (0.1 + Math.random() * 0.5),
      rank: Math.floor(Math.random() * 100) + 1,
      lastUpdated: new Date()
    };
  }

  // Technical indicator calculations
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateSMA(prices, period) {
    if (prices.length < period) return null;
    
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  calculateEMA(prices, period) {
    if (prices.length < period) return null;
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    if (!ema12 || !ema26) return null;
    
    const macdLine = ema12 - ema26;
    return {
      macd: macdLine,
      signal: this.calculateEMA([macdLine], 9),
      histogram: macdLine - this.calculateEMA([macdLine], 9)
    };
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    const sma = this.calculateSMA(prices, period);
    if (!sma) return null;
    
    const recentPrices = prices.slice(-period);
    const variance = recentPrices.reduce((sum, price) => {
      return sum + Math.pow(price - sma, 2);
    }, 0) / period;
    
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  // Utility methods
  mapSymbolsToCoinGeckoIds(symbols) {
    const mapping = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      ADA: 'cardano',
      DOT: 'polkadot',
      MATIC: 'polygon',
      LINK: 'chainlink',
      UNI: 'uniswap'
    };
    
    return symbols.map(symbol => mapping[symbol] || symbol.toLowerCase());
  }

  getSymbolName(symbol) {
    const names = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      SOL: 'Solana',
      ADA: 'Cardano',
      DOT: 'Polkadot',
      MATIC: 'Polygon',
      LINK: 'Chainlink',
      UNI: 'Uniswap'
    };
    
    return names[symbol] || symbol;
  }

  // Cache management
  getFromCache(key, timeout = this.cacheTimeout) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < timeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout
    });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

module.exports = PriceService;
