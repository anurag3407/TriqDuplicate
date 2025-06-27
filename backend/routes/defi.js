const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Mock Solana integration - replace with actual Solana web3.js integration
const mockSolanaData = {
  tokens: [
    {
      mint: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      decimals: 9,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      price: 105.00,
      change24h: 5.8
    },
    {
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      price: 1.00,
      change24h: 0.1
    },
    {
      mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      symbol: 'BONK',
      name: 'Bonk',
      decimals: 5,
      price: 0.000025,
      change24h: 12.5
    }
  ],
  pools: [
    {
      id: 'pool_sol_usdc',
      tokenA: 'SOL',
      tokenB: 'USDC',
      liquidity: 12500000,
      volume24h: 2800000,
      fees24h: 8400,
      apy: 0.125
    },
    {
      id: 'pool_bonk_sol',
      tokenA: 'BONK',
      tokenB: 'SOL',
      liquidity: 5200000,
      volume24h: 1200000,
      fees24h: 3600,
      apy: 0.286
    }
  ]
};

// @route   POST /api/defi/wallet/connect
// @desc    Connect Solana wallet
// @access  Private
router.post('/wallet/connect', auth, [
  body('publicKey').isString().isLength({ min: 32, max: 44 }),
  body('signature').optional().isString(),
  body('walletName').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { publicKey, signature, walletName = 'Phantom' } = req.body;

    // Verify signature (implement actual signature verification)
    // const isValidSignature = await verifyWalletSignature(publicKey, signature);
    // if (!isValidSignature) {
    //   return res.status(400).json({ message: 'Invalid wallet signature' });
    // }

    // Update user with wallet address
    const user = await User.findById(req.user.id);
    
    // Check if wallet already connected
    const existingWallet = user.walletAddresses.find(w => w.address === publicKey);
    if (existingWallet) {
      return res.status(400).json({ message: 'Wallet already connected' });
    }

    user.walletAddresses.push({
      blockchain: 'solana',
      address: publicKey,
      name: walletName,
      verified: true,
      connectedAt: new Date()
    });

    await user.save();

    res.json({
      message: 'Wallet connected successfully',
      wallet: {
        blockchain: 'solana',
        address: publicKey,
        name: walletName
      }
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/defi/wallet/balance
// @desc    Get wallet balances
// @access  Private
router.get('/wallet/balance', auth, async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ message: 'Wallet address required' });
    }

    // Mock balance data - replace with actual Solana RPC calls
    const balances = [
      {
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        balance: 12.5,
        decimals: 9,
        value: 1312.50
      },
      {
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 2500.00,
        decimals: 6,
        value: 2500.00
      },
      {
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        symbol: 'BONK',
        name: 'Bonk',
        balance: 1000000,
        decimals: 5,
        value: 25.00
      }
    ];

    const totalValue = balances.reduce((sum, token) => sum + token.value, 0);

    res.json({
      address,
      totalValue,
      balances
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/defi/tokens
// @desc    Get available DeFi tokens
// @access  Private
router.get('/tokens', auth, async (req, res) => {
  try {
    const { search, sortBy = 'marketCap', limit = 50 } = req.query;
    
    let tokens = [...mockSolanaData.tokens];
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      tokens = tokens.filter(token => 
        token.symbol.toLowerCase().includes(searchTerm) ||
        token.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort tokens
    if (sortBy === 'change24h') {
      tokens.sort((a, b) => b.change24h - a.change24h);
    } else if (sortBy === 'price') {
      tokens.sort((a, b) => b.price - a.price);
    }
    
    tokens = tokens.slice(0, parseInt(limit));

    res.json({
      tokens,
      count: tokens.length
    });
  } catch (error) {
    console.error('Get tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/defi/swap
// @desc    Execute token swap
// @access  Private
router.post('/swap', auth, [
  body('tokenIn').isString(),
  body('tokenOut').isString(),
  body('amountIn').isFloat({ min: 0 }),
  body('slippage').optional().isFloat({ min: 0, max: 50 }),
  body('walletAddress').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tokenIn, tokenOut, amountIn, slippage = 1.0, walletAddress } = req.body;

    // Mock swap calculation - replace with actual DEX integration (Jupiter, Orca, etc.)
    const tokenInData = mockSolanaData.tokens.find(t => t.symbol === tokenIn);
    const tokenOutData = mockSolanaData.tokens.find(t => t.symbol === tokenOut);

    if (!tokenInData || !tokenOutData) {
      return res.status(400).json({ message: 'Token not found' });
    }

    const exchangeRate = tokenInData.price / tokenOutData.price;
    const amountOut = amountIn * exchangeRate;
    const minAmountOut = amountOut * (1 - slippage / 100);
    const priceImpact = 0.25; // Mock price impact
    const fee = amountIn * tokenInData.price * 0.003; // 0.3% fee

    const swapQuote = {
      tokenIn: {
        symbol: tokenIn,
        amount: amountIn,
        value: amountIn * tokenInData.price
      },
      tokenOut: {
        symbol: tokenOut,
        amount: amountOut,
        minAmount: minAmountOut,
        value: amountOut * tokenOutData.price
      },
      exchangeRate,
      priceImpact,
      fee,
      slippage,
      route: ['Jupiter', 'Orca'], // Mock route
      estimatedTime: '15-30 seconds'
    };

    // In a real implementation, execute the swap transaction here
    const transaction = {
      id: `tx_${Date.now()}`,
      status: 'pending',
      signature: null, // Will be filled after transaction
      timestamp: new Date()
    };

    res.json({
      message: 'Swap quote generated',
      quote: swapQuote,
      transaction
    });
  } catch (error) {
    console.error('Swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/defi/pools
// @desc    Get liquidity pools
// @access  Private
router.get('/pools', auth, async (req, res) => {
  try {
    const { minLiquidity, minApy, sortBy = 'apy' } = req.query;
    
    let pools = [...mockSolanaData.pools];
    
    // Filter by minimum liquidity
    if (minLiquidity) {
      pools = pools.filter(pool => pool.liquidity >= parseInt(minLiquidity));
    }
    
    // Filter by minimum APY
    if (minApy) {
      pools = pools.filter(pool => pool.apy >= parseFloat(minApy));
    }
    
    // Sort pools
    if (sortBy === 'apy') {
      pools.sort((a, b) => b.apy - a.apy);
    } else if (sortBy === 'liquidity') {
      pools.sort((a, b) => b.liquidity - a.liquidity);
    }

    res.json({
      pools,
      count: pools.length
    });
  } catch (error) {
    console.error('Get pools error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/defi/stake
// @desc    Stake tokens
// @access  Private
router.post('/stake', auth, [
  body('validator').isString(),
  body('amount').isFloat({ min: 0 }),
  body('walletAddress').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { validator, amount, walletAddress } = req.body;

    // Mock staking data
    const stakeAccount = {
      id: `stake_${Date.now()}`,
      validator,
      amount,
      apy: 0.065, // 6.5% APY
      status: 'activating',
      estimatedRewards: amount * 0.065 / 365, // Daily rewards
      activationEpoch: 450, // Mock epoch
      walletAddress,
      createdAt: new Date()
    };

    res.json({
      message: 'Staking transaction initiated',
      stakeAccount
    });
  } catch (error) {
    console.error('Stake error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/defi/stakes
// @desc    Get user stakes
// @access  Private
router.get('/stakes', auth, async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    // Mock stakes data
    const stakes = [
      {
        id: 'stake_1',
        validator: 'Validator ABC',
        amount: 50.0,
        apy: 0.065,
        status: 'active',
        rewards: 2.15,
        activationEpoch: 448,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'stake_2',
        validator: 'Validator XYZ',
        amount: 25.0,
        apy: 0.072,
        status: 'active',
        rewards: 1.05,
        activationEpoch: 449,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
    const totalRewards = stakes.reduce((sum, stake) => sum + stake.rewards, 0);

    res.json({
      stakes,
      summary: {
        totalStaked,
        totalRewards,
        averageApy: stakes.reduce((sum, stake) => sum + stake.apy, 0) / stakes.length
      }
    });
  } catch (error) {
    console.error('Get stakes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/defi/analytics
// @desc    Get DeFi analytics
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const analytics = {
      tvl: {
        total: 1250000000, // $1.25B
        change24h: 3.2,
        protocols: [
          { name: 'Jupiter', tvl: 450000000, change24h: 2.1 },
          { name: 'Marinade', tvl: 380000000, change24h: 4.5 },
          { name: 'Orca', tvl: 220000000, change24h: 1.8 },
          { name: 'Raydium', tvl: 200000000, change24h: 5.2 }
        ]
      },
      volume: {
        total24h: 185000000, // $185M
        change24h: 15.2,
        breakdown: {
          swap: 120000000,
          lending: 35000000,
          staking: 30000000
        }
      },
      yields: {
        averageApy: 0.085,
        topOpportunities: [
          { protocol: 'Marinade', asset: 'mSOL', apy: 0.125 },
          { protocol: 'Orca', asset: 'SOL-USDC', apy: 0.095 },
          { protocol: 'Jupiter', asset: 'JUP', apy: 0.087 }
        ]
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
