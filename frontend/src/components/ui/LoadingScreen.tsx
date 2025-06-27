interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-secondary-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin glow-pink"></div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            TRIQ AI Trading
          </span>
        </h3>
        <p className="text-sm text-secondary-400">{message}</p>
        
        {/* Pulse dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full pulse-dot"></div>
          <div className="w-2 h-2 bg-secondary-500 rounded-full pulse-dot"></div>
          <div className="w-2 h-2 bg-primary-400 rounded-full pulse-dot"></div>
        </div>
      </div>
    </div>
  );
}
