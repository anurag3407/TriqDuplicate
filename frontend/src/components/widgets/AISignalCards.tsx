import { BoltIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface AISignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  reasoning: string;
  timestamp: number;
}

const mockSignals: AISignal[] = [
  {
    id: '1',
    symbol: 'BTC',
    type: 'BUY',
    confidence: 87,
    price: 45234,
    reasoning: 'Strong momentum and institutional accumulation detected',
    timestamp: Date.now() - 300000
  },
  {
    id: '2',
    symbol: 'NVDA',
    type: 'SELL',
    confidence: 72,
    price: 456,
    reasoning: 'Overbought conditions with potential resistance at $460',
    timestamp: Date.now() - 600000
  },
  {
    id: '3',
    symbol: 'ETH',
    type: 'HOLD',
    confidence: 65,
    price: 3234,
    reasoning: 'Consolidation phase, awaiting breakout confirmation',
    timestamp: Date.now() - 900000
  }
];

function SignalCard({ signal }: { signal: AISignal }) {
  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'text-green-400 border-green-500 bg-green-500/10';
      case 'SELL': return 'text-red-400 border-red-500 bg-red-500/10';
      default: return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY': return <ArrowTrendingUpIcon className="w-4 h-4" />;
      case 'SELL': return <ArrowTrendingDownIcon className="w-4 h-4" />;
      default: return <BoltIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="glass-card p-4 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">{signal.symbol}</span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getSignalColor(signal.type)}`}>
            {getSignalIcon(signal.type)}
            <span className="text-xs font-medium">{signal.type}</span>
          </div>
        </div>
        <span className="text-xs text-secondary-400">
          {new Date(signal.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary-400">Confidence</span>
          <span className="text-sm font-medium text-white">{signal.confidence}%</span>
        </div>
        
        <div className="w-full bg-secondary-800/50 rounded-full h-2 border border-secondary-700">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              signal.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
              signal.confidence >= 60 ? 'bg-gradient-to-r from-accent-amber to-yellow-400' : 
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${signal.confidence}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary-400">Price</span>
          <span className="text-sm font-medium text-white">
            ${signal.price.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-secondary-300 mt-2 leading-relaxed">
          {signal.reasoning}
        </p>
      </div>
    </div>
  );
}

export function AISignalCards() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <BoltIcon className="w-5 h-5 text-blue-400" />
          <span>AI Signals</span>
        </h3>
        <span className="text-xs text-gray-400">Real-time</span>
      </div>
      
      <div className="space-y-3">
        {mockSignals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors">
        View All Signals
      </button>
    </div>
  );
}
