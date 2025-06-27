const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, requirePremium } = require('../middleware/auth');

const router = express.Router();

// Mock trading data - replace with real trading engine
const mockMarketData = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 35000.00,
    change24h: 2.45,
    volume24h: 28500000000,
    marketCap: 685000000000,
    high24h: 35500.00,
    low24h: 34200.00
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 1650.00,
    change24h: -1.2,
    volume24h: 12500000000,
    marketCap: 198000000000,
    high24h: 1680.00,
    low24h: 1620.00
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    price: 105.00,
    change24h: 5.8,
    volume24h: 2800000000,
    marketCap: 45000000000,
    high24h: 108.50,
    low24h: 98.20
  }
};

// @route   GET /api/trading/markets
// @desc    Get market data
// @access  Private
router.get('/markets', auth, async (req, res) => {
  try {
    const { symbols, sortBy = 'marketCap', order = 'desc' } = req.query;
    
    let markets = Object.values(mockMarketData);
    
    // Filter by symbols if provided
    if (symbols) {
      const symbolArray = symbols.split(',');
      markets = markets.filter(market => symbolArray.includes(market.symbol));
    }
    
    // Sort markets
    markets.sort((a, b) => {
      const multiplier = order === 'desc' ? -1 : 1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    });

    res.json({ markets });
  } catch (error) {
    console.error('Get markets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trading/orderbook/:symbol
// @desc    Get order book for symbol
// @access  Private
router.get('/orderbook/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { depth = 20 } = req.query;

    // Mock order book data
    const orderbook = generateMockOrderbook(symbol, parseInt(depth));

    res.json({ orderbook });
  } catch (error) {
    console.error('Get orderbook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trading/order
// @desc    Place trading order
// @access  Private
router.post('/order', auth, [
  body('symbol').isString().isLength({ min: 2, max: 10 }),
  body('side').isIn(['buy', 'sell']),
  body('type').isIn(['market', 'limit', 'stop', 'stop_limit']),
  body('quantity').isFloat({ min: 0.000001 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stopPrice').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { symbol, side, type, quantity, price, stopPrice, timeInForce = 'GTC' } = req.body;

    // Validate market exists
    if (!mockMarketData[symbol]) {
      return res.status(400).json({ message: 'Invalid trading pair' });
    }

    // Mock order validation and placement
    const currentPrice = mockMarketData[symbol].price;
    const estimatedValue = price || currentPrice;
    const totalValue = quantity * estimatedValue;

    // Mock balance check (implement with real balance service)
    const mockBalance = 100000; // USD
    if (side === 'buy' && totalValue > mockBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create order
    const order = {
      id: `order_${Date.now()}`,
      userId: req.user.id,
      symbol,
      side,
      type,
      quantity,
      price,
      stopPrice,
      timeInForce,
      status: type === 'market' ? 'filled' : 'open',
      filled: type === 'market' ? quantity : 0,
      remaining: type === 'market' ? 0 : quantity,
      avgFillPrice: type === 'market' ? currentPrice : null,
      fees: totalValue * 0.001, // 0.1% fee
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trading/orders
// @desc    Get user orders
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    const { status, symbol, limit = 50, page = 1 } = req.query;

    // Mock orders data
    const orders = generateMockOrders(req.user.id, { status, symbol, limit: parseInt(limit) });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trading/order/:orderId
// @desc    Cancel order
// @access  Private
router.delete('/order/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Mock order cancellation
    const cancelledOrder = {
      id: orderId,
      status: 'cancelled',
      cancelledAt: new Date()
    };

    res.json({
      message: 'Order cancelled successfully',
      order: cancelledOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trading/history
// @desc    Get trading history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { symbol, startDate, endDate, limit = 100 } = req.query;

    // Mock trading history
    const trades = generateMockTrades(req.user.id, { symbol, startDate, endDate, limit: parseInt(limit) });

    const summary = {
      totalTrades: trades.length,
      totalVolume: trades.reduce((sum, trade) => sum + trade.value, 0),
      totalFees: trades.reduce((sum, trade) => sum + trade.fees, 0),
      profitLoss: trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    };

    res.json({
      trades,
      summary
    });
  } catch (error) {
    console.error('Get trading history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trading/strategy
// @desc    Create trading strategy
// @access  Private (Premium)
router.post('/strategy', auth, requirePremium, [
  body('name').isString().isLength({ min: 3, max: 50 }),
  body('description').optional().isString().isLength({ max: 500 }),
  body('rules').isArray().isLength({ min: 1 }),
  body('riskManagement').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, rules, riskManagement, symbols } = req.body;

    // Mock strategy creation
    const strategy = {
      id: `strategy_${Date.now()}`,
      userId: req.user.id,
      name,
      description,
      rules,
      riskManagement,
      symbols: symbols || ['BTC', 'ETH'],
      status: 'active',
      performance: {
        totalTrades: 0,
        winRate: 0,
        profitLoss: 0,
        maxDrawdown: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Strategy created successfully',
      strategy
    });
  } catch (error) {
    console.error('Create strategy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trading/strategies
// @desc    Get user trading strategies
// @access  Private
router.get('/strategies', auth, async (req, res) => {
  try {
    // Mock strategies data
    const strategies = [
      {
        id: 'strategy_1',
        name: 'BTC Momentum',
        description: 'Momentum-based strategy for Bitcoin',
        status: 'active',
        performance: {
          totalTrades: 45,
          winRate: 62.2,
          profitLoss: 2850.50,
          maxDrawdown: -580.20
        }
      },
      {
        id: 'strategy_2',
        name: 'ETH DCA',
        description: 'Dollar-cost averaging for Ethereum',
        status: 'paused',
        performance: {
          totalTrades: 12,
          winRate: 75.0,
          profitLoss: 1200.00,
          maxDrawdown: -150.00
        }
      }
    ];

    res.json({ strategies });
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
function generateMockOrderbook(symbol, depth) {
  const currentPrice = mockMarketData[symbol]?.price || 35000;
  const bids = [];
  const asks = [];

  for (let i = 0; i < depth; i++) {
    bids.push({
      price: currentPrice - (i + 1) * 10,
      quantity: Math.random() * 5 + 0.1,
      total: 0
    });

    asks.push({
      price: currentPrice + (i + 1) * 10,
      quantity: Math.random() * 5 + 0.1,
      total: 0
    });
  }

  return { bids, asks };
}

function generateMockOrders(userId, filters) {
  const orders = [
    {
      id: 'order_1',
      symbol: 'BTC',
      side: 'buy',
      type: 'limit',
      quantity: 0.5,
      price: 34500,
      status: 'open',
      filled: 0,
      remaining: 0.5,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'order_2',
      symbol: 'ETH',
      side: 'sell',
      type: 'market',
      quantity: 2.0,
      status: 'filled',
      filled: 2.0,
      remaining: 0,
      avgFillPrice: 1650,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ];

  return orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.symbol && order.symbol !== filters.symbol) return false;
    return true;
  });
}

function generateMockTrades(userId, filters) {
  return [
    {
      id: 'trade_1',
      orderId: 'order_2',
      symbol: 'ETH',
      side: 'sell',
      quantity: 2.0,
      price: 1650,
      value: 3300,
      fees: 3.30,
      pnl: 150.00,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'trade_2',
      orderId: 'order_3',
      symbol: 'BTC',
      side: 'buy',
      quantity: 0.1,
      price: 34800,
      value: 3480,
      fees: 3.48,
      pnl: -50.00,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ];
}

module.exports = router;
