import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle,
  Shield,
  Zap
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'sharpe',
    title: 'Sharpe Ratio',
    value: '2.34',
    change: 12.5,
    icon: <Target className="w-5 h-5" />,
    color: 'text-blue-400'
  },
  {
    id: 'volatility',
    title: 'Volatility',
    value: '24.8%',
    change: -3.2,
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-yellow-400'
  },
  {
    id: 'maxDrawdown',
    title: 'Max Drawdown',
    value: '-12.3%',
    change: 1.8,
    icon: <Shield className="w-5 h-5" />,
    color: 'text-red-400'
  },
  {
    id: 'winRate',
    title: 'Win Rate',
    value: '67.8%',
    change: 4.1,
    icon: <Zap className="w-5 h-5" />,
    color: 'text-green-400'
  }
];

const performanceData = [
  { period: '1D', return: 2.34, benchmark: 1.85 },
  { period: '1W', return: 8.92, benchmark: 6.23 },
  { period: '1M', return: 15.67, benchmark: 12.45 },
  { period: '3M', return: 28.94, benchmark: 21.33 },
  { period: '6M', return: 45.21, benchmark: 34.87 },
  { period: '1Y', return: 87.32, benchmark: 62.15 }
];

const riskMetrics = [
  { name: 'Value at Risk (95%)', value: '$2,450', description: 'Daily potential loss' },
  { name: 'Beta', value: '1.23', description: 'Market correlation' },
  { name: 'Alpha', value: '0.078', description: 'Excess return' },
  { name: 'Information Ratio', value: '1.45', description: 'Risk-adjusted performance' }
];

const sectorAllocation = [
  { name: 'Technology', allocation: 35.2, value: 22140, color: 'bg-blue-500' },
  { name: 'Finance', allocation: 28.7, value: 18050, color: 'bg-green-500' },
  { name: 'Healthcare', allocation: 15.3, value: 9620, color: 'bg-purple-500' },
  { name: 'Energy', allocation: 12.8, value: 8045, color: 'bg-yellow-500' },
  { name: 'Consumer', allocation: 8.0, value: 5030, color: 'bg-pink-500' }
];

export const Analytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-primary-400" />
        <h2 className="text-xl font-bold text-white">Portfolio Analytics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {analyticsMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-dark-700/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${metric.color}`}>
                {metric.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-400">{metric.title}</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">{metric.value}</span>
              <div className={`flex items-center gap-1 text-sm ${
                metric.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {formatPercentage(Math.abs(metric.change))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Comparison */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Performance vs Benchmark</h3>
            <div className="flex gap-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-xs rounded-lg transition-all ${
                    selectedTimeframe === timeframe
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {performanceData.map((data, index) => (
              <motion.div
                key={data.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-dark-700/20 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{data.period}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary-400">Portfolio: {formatPercentage(data.return)}</span>
                    <span className="text-gray-400">Benchmark: {formatPercentage(data.benchmark)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-dark-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(data.return / 100 * 100, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-2 bg-primary-500 rounded-full"
                    />
                  </div>
                  <div className="flex-1 bg-dark-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(data.benchmark / 100 * 100, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-2 bg-gray-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Risk Analysis</h3>
          
          <div className="space-y-3">
            {riskMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-dark-700/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{metric.name}</span>
                  <span className="text-xl font-bold text-primary-400">{metric.value}</span>
                </div>
                <p className="text-sm text-gray-400">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Allocation */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Sector Allocation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectorAllocation.map((sector, index) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-dark-700/20 rounded-lg p-4 text-center"
            >
              <div className={`w-12 h-12 ${sector.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-white mb-1">{sector.name}</h4>
              <p className="text-lg font-bold text-primary-400">{formatPercentage(sector.allocation)}</p>
              <p className="text-sm text-gray-400">{formatCurrency(sector.value)}</p>
              
              {/* Allocation Bar */}
              <div className="mt-3 w-full bg-dark-600 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sector.allocation}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-2 ${sector.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
