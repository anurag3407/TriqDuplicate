import { 
  HomeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  CogIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useUIStore } from '../../stores';
import { cn } from '../../utils';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'trading', name: 'Trading', icon: CurrencyDollarIcon },
  { id: 'portfolio', name: 'Portfolio', icon: ChartBarIcon },
  { id: 'analytics', name: 'Analytics', icon: GlobeAltIcon },
  { id: 'ai-signals', name: 'AI Signals', icon: BoltIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon },
];

export function Sidebar() {
  const { sidebarOpen, activeTab, setActiveTab, toggleSidebar } = useUIStore();

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      <div className="flex h-full flex-col glass-card border-r border-secondary-700 backdrop-blur-xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-700">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center ring-2 ring-primary-500/30">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-white font-semibold text-lg">
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  TRIQ AI
                </span>
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary-800/50 transition-colors group"
          >
            <svg 
              className="w-5 h-5 text-secondary-400 group-hover:text-primary-400 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30 glow-pink' 
                    : 'text-secondary-400 hover:bg-secondary-800/50 hover:text-white border border-transparent',
                  !sidebarOpen && 'justify-center'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive && 'text-primary-400',
                  sidebarOpen && 'mr-3'
                )} />
                {sidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-secondary-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  AI Assistant
                </p>
                <p className="text-xs text-green-400">
                  Online
                </p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
