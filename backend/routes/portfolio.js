const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, requirePremium } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Mock portfolio data - replace with real database models
const mockPortfolioData = {
  totalValue: 125750.00,
  dailyChange: 2.45,
  dailyChangePercent: 1.98,
  holdings: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 2.5,
      value: 87500.00,
      change24h: 3.2,
      allocation: 69.7
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 15.2,
      value: 25125.00,
      change24h: -1.5,
      allocation: 20.0
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: 125.0,
      value: 13125.00,
      change24h: 5.8,
      allocation: 10.4
    }
  ],
  performance: {
    '1D': 1.98,
    '1W': 8.5,
    '1M': 15.2,
    '3M': 28.7,
    '1Y': 145.3
  }
};

// @route   GET /api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // In a real implementation, fetch from portfolio database
    // const portfolio = await Portfolio.findOne({ userId: req.user.id });
    
    res.json({
      portfolio: mockPortfolioData
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/holdings
// @desc    Get portfolio holdings
// @access  Private
router.get('/holdings', auth, async (req, res) => {
  try {
    const { sortBy = 'value', order = 'desc' } = req.query;
    
    let holdings = [...mockPortfolioData.holdings];
    
    // Sort holdings
    holdings.sort((a, b) => {
      const multiplier = order === 'desc' ? -1 : 1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    });

    res.json({ holdings });
  } catch (error) {
    console.error('Get holdings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/performance
// @desc    Get portfolio performance metrics
// @access  Private
router.get('/performance', auth, async (req, res) => {
  try {
    const { period = '1M' } = req.query;
    
    // Mock performance data - replace with real calculation
    const performanceData = {
      period,
      totalReturn: mockPortfolioData.performance[period] || 0,
      chartData: generateMockChartData(period),
      metrics: {
        sharpeRatio: 1.85,
        maxDrawdown: -12.3,
        volatility: 18.5,
        alpha: 2.3,
        beta: 1.1
      }
    };

    res.json(performanceData);
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/portfolio/rebalance
// @desc    Rebalance portfolio
// @access  Private (Premium)
router.post('/rebalance', auth, requirePremium, [
  body('targetAllocations').isArray(),
  body('targetAllocations.*.symbol').isString(),
  body('targetAllocations.*.percentage').isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { targetAllocations } = req.body;
    
    // Validate total allocation equals 100%
    const totalAllocation = targetAllocations.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      return res.status(400).json({ message: 'Total allocation must equal 100%' });
    }

    // Mock rebalancing logic - implement actual trading logic
    const rebalanceResult = {
      success: true,
      trades: [
        { action: 'sell', symbol: 'BTC', amount: 0.3, value: 10500 },
        { action: 'buy', symbol: 'ETH', amount: 3.2, value: 5280 },
        { action: 'buy', symbol: 'SOL', amount: 50, value: 5250 }
      ],
      estimatedFees: 45.50,
      estimatedTime: '2-5 minutes'
    };

    res.json({
      message: 'Rebalance initiated successfully',
      result: rebalanceResult
    });
  } catch (error) {
    console.error('Rebalance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/analytics
// @desc    Get advanced portfolio analytics
// @access  Private (Premium)
router.get('/analytics', auth, requirePremium, async (req, res) => {
  try {
    const analytics = {
      riskMetrics: {
        portfolioRisk: 'Medium',
        riskScore: 65,
        correlationMatrix: generateCorrelationMatrix(),
        concentrationRisk: 'Low'
      },
      diversification: {
        score: 78,
        suggestions: [
          'Consider adding exposure to traditional assets',
          'Reduce Bitcoin concentration below 60%',
          'Add more DeFi tokens for yield opportunities'
        ]
      },
      taxOptimization: {
        unrealizedGains: 45250.00,
        unrealizedLosses: 2150.00,
        taxLossHarvesting: 1850.00,
        holdingPeriods: {
          shortTerm: 15.2,
          longTerm: 84.8
        }
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/portfolio/alert
// @desc    Set portfolio alert
// @access  Private
router.post('/alert', auth, [
  body('type').isIn(['price', 'percentage', 'value']),
  body('condition').isIn(['above', 'below']),
  body('threshold').isNumeric(),
  body('symbol').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, condition, threshold, symbol, message } = req.body;

    // Mock alert creation - implement with real database
    const alert = {
      id: Date.now().toString(),
      userId: req.user.id,
      type,
      condition,
      threshold,
      symbol,
      message: message || `Portfolio ${type} ${condition} ${threshold}`,
      active: true,
      createdAt: new Date()
    };

    res.json({
      message: 'Alert created successfully',
      alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate mock chart data
function generateMockChartData(period) {
  const dataPoints = {
    '1D': 24,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365
  };

  const points = dataPoints[period] || 30;
  const data = [];
  let baseValue = 100000;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2000;
    baseValue += change;
    data.push({
      timestamp: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000),
      value: Math.max(baseValue, 50000)
    });
  }

  return data;
}

// Helper function to generate correlation matrix
function generateCorrelationMatrix() {
  return {
    BTC: { BTC: 1.0, ETH: 0.75, SOL: 0.68 },
    ETH: { BTC: 0.75, ETH: 1.0, SOL: 0.82 },
    SOL: { BTC: 0.68, ETH: 0.82, SOL: 1.0 }
  };
}

module.exports = router;
