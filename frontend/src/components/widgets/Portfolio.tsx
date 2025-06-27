import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent, Eye, EyeOff } from 'lucide-react';
import { usePortfolioStore } from '../../stores';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils';

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  allocation: number;
  avgBuyPrice: number;
  currentPrice: number;
}

const mockAssets: PortfolioAsset[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.5432,
    value: 28450.00,
    change24h: 3.42,
    allocation: 45.2,
    avgBuyPrice: 51200,
    currentPrice: 52398
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 8.2341,
    value: 18920.50,
    change24h: -1.28,
    allocation: 30.1,
    avgBuyPrice: 2280,
    currentPrice: 2298
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana',
    amount: 125.5,
    value: 9876.25,
    change24h: 7.89,
    allocation: 15.7,
    avgBuyPrice: 78.2,
    currentPrice: 78.7
  },
  {
    id: '4',
    symbol: 'MATIC',
    name: 'Polygon',
    amount: 3421.7,
    value: 5678.90,
    change24h: 2.15,
    allocation: 9.0,
    avgBuyPrice: 1.65,
    currentPrice: 1.66
  }
];

export const Portfolio: React.FC = () => {
  const { isBalanceVisible, toggleBalanceVisibility } = usePortfolioStore();
  
  const totalPortfolioValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalPortfolioPnL = mockAssets.reduce((sum, asset) => {
    const pnl = (asset.currentPrice - asset.avgBuyPrice) * asset.amount;
    return sum + pnl;
  }, 0);
  const totalPnLPercentage = (totalPortfolioPnL / (totalPortfolioValue - totalPortfolioPnL)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-4 lg:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Portfolio</h2>
        <button
          onClick={toggleBalanceVisibility}
          className="p-2 rounded-lg bg-secondary-800/50 hover:bg-secondary-700/50 transition-colors border border-secondary-700"
        >
          {isBalanceVisible ? (
            <Eye className="w-4 h-4 text-secondary-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-secondary-400" />
          )}
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary-800/30 rounded-xl p-4 border border-secondary-700/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-secondary-400">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {isBalanceVisible ? formatCurrency(totalPortfolioValue) : '••••••'}
          </div>
        </div>

        <div className="bg-secondary-800/30 rounded-xl p-4 border border-secondary-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-accent-green" />
            <span className="text-sm text-secondary-400">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${totalPnLPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {isBalanceVisible ? (
              <div className="flex items-center gap-1">
                {totalPnLPercentage >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {formatPercentage(Math.abs(totalPnLPercentage))}
              </div>
            ) : (
              '••••••'
            )}
          </div>
        </div>

        <div className="bg-secondary-800/30 rounded-xl p-4 border border-secondary-700/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-accent-amber" />
            <span className="text-sm text-secondary-400">P&L Amount</span>
          </div>
          <div className={`text-2xl font-bold ${totalPortfolioPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {isBalanceVisible ? (
              `${totalPortfolioPnL >= 0 ? '+' : ''}${formatCurrency(totalPortfolioPnL)}`
            ) : (
              '••••••'
            )}
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">Holdings</h3>
        {mockAssets.map((asset, index) => {
          const pnl = (asset.currentPrice - asset.avgBuyPrice) * asset.amount;
          const pnlPercentage = ((asset.currentPrice - asset.avgBuyPrice) / asset.avgBuyPrice) * 100;
          
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-secondary-800/20 border border-secondary-700/30 rounded-xl p-4 hover:bg-secondary-800/40 transition-all duration-300 hover:border-primary-500/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 flex items-center justify-center ring-2 ring-primary-500/30">
                    <span className="text-sm font-bold text-white">{asset.symbol[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{asset.symbol}</h4>
                    <p className="text-sm text-secondary-400">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {isBalanceVisible ? formatCurrency(asset.value) : '••••••'}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {formatPercentage(Math.abs(asset.change24h))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Amount</span>
                  <div className="text-white font-medium">
                    {isBalanceVisible ? formatNumber(asset.amount) : '••••••'} {asset.symbol}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Avg Buy Price</span>
                  <div className="text-white font-medium">
                    {formatCurrency(asset.avgBuyPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Current Price</span>
                  <div className="text-white font-medium">
                    {formatCurrency(asset.currentPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Unrealized P&L</span>
                  <div className={`font-medium ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {isBalanceVisible ? (
                      <>
                        {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                        <span className="text-xs ml-1">
                          ({pnlPercentage >= 0 ? '+' : ''}{formatPercentage(pnlPercentage)})
                        </span>
                      </>
                    ) : (
                      '••••••'
                    )}
                  </div>
                </div>
              </div>

              {/* Allocation Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Portfolio Allocation</span>
                  <span>{formatPercentage(asset.allocation)}</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${asset.allocation}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
