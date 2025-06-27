const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Map<userId, WebSocket>
    this.priceSubscriptions = new Map(); // Map<symbol, Set<userId>>
    this.portfolioSubscriptions = new Set(); // Set<userId>
    
    this.init();
  }

  init() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection');
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Start price feed simulation
    this.startPriceFeed();
    this.startPortfolioUpdates();
  }

  async handleMessage(ws, data) {
    const { type, payload } = data;

    switch (type) {
      case 'auth':
        await this.handleAuth(ws, payload);
        break;
      
      case 'subscribe_prices':
        this.handlePriceSubscription(ws, payload);
        break;
      
      case 'unsubscribe_prices':
        this.handlePriceUnsubscription(ws, payload);
        break;
      
      case 'subscribe_portfolio':
        this.handlePortfolioSubscription(ws);
        break;
      
      case 'unsubscribe_portfolio':
        this.handlePortfolioUnsubscription(ws);
        break;
      
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  async handleAuth(ws, payload) {
    try {
      const { token } = payload;
      
      if (!token) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Token required' }));
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'User not found' }));
        return;
      }

      ws.userId = user._id.toString();
      this.clients.set(ws.userId, ws);
      
      ws.send(JSON.stringify({ 
        type: 'auth_success', 
        message: 'Authenticated successfully',
        userId: ws.userId
      }));
      
      console.log(`User ${ws.userId} authenticated via WebSocket`);
    } catch (error) {
      console.error('Auth error:', error);
      ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
    }
  }

  handlePriceSubscription(ws, payload) {
    if (!ws.userId) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
      return;
    }

    const { symbols } = payload;
    
    if (!Array.isArray(symbols)) {
      ws.send(JSON.stringify({ type: 'error', message: 'Symbols must be an array' }));
      return;
    }

    symbols.forEach(symbol => {
      if (!this.priceSubscriptions.has(symbol)) {
        this.priceSubscriptions.set(symbol, new Set());
      }
      this.priceSubscriptions.get(symbol).add(ws.userId);
    });

    ws.send(JSON.stringify({ 
      type: 'price_subscription_success', 
      symbols 
    }));
    
    console.log(`User ${ws.userId} subscribed to prices:`, symbols);
  }

  handlePriceUnsubscription(ws, payload) {
    if (!ws.userId) return;

    const { symbols } = payload;
    
    symbols.forEach(symbol => {
      if (this.priceSubscriptions.has(symbol)) {
        this.priceSubscriptions.get(symbol).delete(ws.userId);
        
        // Clean up empty subscriptions
        if (this.priceSubscriptions.get(symbol).size === 0) {
          this.priceSubscriptions.delete(symbol);
        }
      }
    });

    ws.send(JSON.stringify({ 
      type: 'price_unsubscription_success', 
      symbols 
    }));
  }

  handlePortfolioSubscription(ws) {
    if (!ws.userId) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
      return;
    }

    this.portfolioSubscriptions.add(ws.userId);
    
    ws.send(JSON.stringify({ 
      type: 'portfolio_subscription_success' 
    }));
    
    console.log(`User ${ws.userId} subscribed to portfolio updates`);
  }

  handlePortfolioUnsubscription(ws) {
    if (!ws.userId) return;

    this.portfolioSubscriptions.delete(ws.userId);
    
    ws.send(JSON.stringify({ 
      type: 'portfolio_unsubscription_success' 
    }));
  }

  handleDisconnect(ws) {
    if (!ws.userId) return;

    console.log(`User ${ws.userId} disconnected`);
    
    // Clean up subscriptions
    this.clients.delete(ws.userId);
    this.portfolioSubscriptions.delete(ws.userId);
    
    // Clean up price subscriptions
    this.priceSubscriptions.forEach((userSet, symbol) => {
      userSet.delete(ws.userId);
      if (userSet.size === 0) {
        this.priceSubscriptions.delete(symbol);
      }
    });
  }

  // Broadcast price updates
  broadcastPriceUpdate(symbol, priceData) {
    if (!this.priceSubscriptions.has(symbol)) return;

    const message = JSON.stringify({
      type: 'price_update',
      symbol,
      data: priceData,
      timestamp: Date.now()
    });

    this.priceSubscriptions.get(symbol).forEach(userId => {
      const ws = this.clients.get(userId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // Broadcast portfolio updates
  broadcastPortfolioUpdate(userId, portfolioData) {
    if (!this.portfolioSubscriptions.has(userId)) return;

    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'portfolio_update',
        data: portfolioData,
        timestamp: Date.now()
      }));
    }
  }

  // Broadcast AI signals
  broadcastAISignal(signal) {
    const message = JSON.stringify({
      type: 'ai_signal',
      data: signal,
      timestamp: Date.now()
    });

    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // Broadcast trade notifications
  broadcastTradeNotification(userId, tradeData) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'trade_notification',
        data: tradeData,
        timestamp: Date.now()
      }));
    }
  }

  // Start simulated price feed
  startPriceFeed() {
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
    const basePrices = {
      BTC: 35000,
      ETH: 1650,
      SOL: 105,
      ADA: 0.45,
      DOT: 6.20
    };

    setInterval(() => {
      symbols.forEach(symbol => {
        if (this.priceSubscriptions.has(symbol)) {
          const basePrice = basePrices[symbol];
          const change = (Math.random() - 0.5) * 0.02; // ±1% change
          const newPrice = basePrice * (1 + change);
          
          const priceData = {
            price: Number(newPrice.toFixed(symbol === 'ADA' ? 4 : 2)),
            change24h: (Math.random() - 0.5) * 10, // ±5% daily change
            volume: Math.floor(Math.random() * 1000000000),
            timestamp: Date.now()
          };

          this.broadcastPriceUpdate(symbol, priceData);
        }
      });
    }, 2000); // Update every 2 seconds
  }

  // Start portfolio updates
  startPortfolioUpdates() {
    setInterval(() => {
      this.portfolioSubscriptions.forEach(userId => {
        // Generate mock portfolio update
        const portfolioUpdate = {
          totalValue: 125000 + (Math.random() - 0.5) * 5000,
          dailyChange: (Math.random() - 0.5) * 1000,
          dailyChangePercent: (Math.random() - 0.5) * 5,
          lastUpdated: Date.now()
        };

        this.broadcastPortfolioUpdate(userId, portfolioUpdate);
      });
    }, 10000); // Update every 10 seconds
  }

  // Get connection stats
  getStats() {
    return {
      totalConnections: this.clients.size,
      priceSubscriptions: Array.from(this.priceSubscriptions.entries()).map(([symbol, users]) => ({
        symbol,
        subscribers: users.size
      })),
      portfolioSubscriptions: this.portfolioSubscriptions.size
    };
  }
}

module.exports = WebSocketService;
