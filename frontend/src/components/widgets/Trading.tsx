import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useMarketStore } from '../../stores';
import { formatCurrency, formatPercentage } from '../../utils';
import { cn } from '../../utils';

interface OrderFormData {
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  quantity: string;
  price: string;
  stopPrice: string;
}

const initialFormData: OrderFormData = {
  symbol: 'BTC',
  type: 'market',
  side: 'buy',
  quantity: '',
  price: '',
  stopPrice: ''
};

const mockOrders = [
  {
    id: '1',
    symbol: 'BTC',
    type: 'limit',
    side: 'buy',
    quantity: 0.1,
    price: 52000,
    status: 'pending',
    timestamp: Date.now() - 300000
  },
  {
    id: '2',
    symbol: 'ETH',
    type: 'market',
    side: 'sell',
    quantity: 2.5,
    price: 2300,
    status: 'filled',
    timestamp: Date.now() - 600000
  },
  {
    id: '3',
    symbol: 'SOL',
    type: 'stop',
    side: 'sell',
    quantity: 50,
    price: 75,
    stopPrice: 78,
    status: 'cancelled',
    timestamp: Date.now() - 900000
  }
];

export const Trading: React.FC = () => {
  const { selectedSymbol, marketData } = useMarketStore();
  const [formData, setFormData] = useState<OrderFormData>({
    ...initialFormData,
    symbol: selectedSymbol
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPrice = marketData[selectedSymbol]?.price || 52398; // Mock price
  const priceChange = marketData[selectedSymbol]?.change || 3.42;

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    // Mock order submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrder = {
      id: Math.random().toString(36).substring(7),
      symbol: formData.symbol,
      type: formData.type,
      side: formData.side,
      quantity: parseFloat(formData.quantity),
      price: formData.type === 'market' ? currentPrice : parseFloat(formData.price),
      stopPrice: formData.type === 'stop' ? parseFloat(formData.stopPrice) : undefined,
      status: formData.type === 'market' ? 'filled' : 'pending',
      timestamp: Date.now()
    };

    // Add to store (mock)
    console.log('Order submitted:', newOrder);
    
    // Reset form
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

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
        <h2 className="text-xl font-bold text-white">Trading</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Place Order</h3>

          {/* Current Price */}
          <div className="bg-dark-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{selectedSymbol} Current Price</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(currentPrice)}</p>
              </div>
              <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {formatPercentage(Math.abs(priceChange))}
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Order Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['market', 'limit', 'stop'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleInputChange('type', type)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    formData.type === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50'
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Buy/Sell Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Side
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleInputChange('side', 'buy')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  formData.side === 'buy'
                    ? 'bg-green-500 text-white'
                    : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50'
                )}
              >
                Buy
              </button>
              <button
                onClick={() => handleInputChange('side', 'sell')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  formData.side === 'sell'
                    ? 'bg-red-500 text-white'
                    : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50'
                )}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Quantity
            </label>
            <input
              type="number"
              step="0.0001"
              placeholder="0.0000"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-dark-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Price (for limit/stop orders) */}
          {(formData.type === 'limit' || formData.type === 'stop') && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-dark-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Stop Price (for stop orders) */}
          {formData.type === 'stop' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stop Price
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.stopPrice}
                onChange={(e) => handleInputChange('stopPrice', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-dark-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting || !formData.quantity || (formData.type !== 'market' && !formData.price)}
            className={cn(
              'w-full px-6 py-3 rounded-lg font-medium transition-all',
              formData.side === 'buy'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white',
              isSubmitting || !formData.quantity || (formData.type !== 'market' && !formData.price)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            )}
          >
            {isSubmitting ? 'Placing Order...' : `${formData.side === 'buy' ? 'Buy' : 'Sell'} ${selectedSymbol}`}
          </button>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          
          <div className="space-y-3">
            {mockOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-dark-700/20 border border-dark-600/30 rounded-xl p-4 hover:bg-dark-700/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getOrderStatusIcon(order.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{order.symbol}</span>
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          order.side === 'buy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        )}>
                          {order.side.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{order.type} order</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{order.quantity}</p>
                    <p className={`text-sm ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Price</span>
                    <div className="text-white font-medium">
                      {formatCurrency(order.price)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Time</span>
                    <div className="text-white font-medium">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {order.stopPrice && (
                  <div className="mt-2 pt-2 border-t border-dark-600/30">
                    <span className="text-xs text-gray-400">Stop Price: </span>
                    <span className="text-white font-medium">{formatCurrency(order.stopPrice)}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
