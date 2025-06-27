import { BellIcon, MagnifyingGlassIcon, PlayIcon, StopIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useUIStore } from '../../stores';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../../utils';
import { startDemo, stopDemo, isDemoActive } from '../../utils/demoController';
import { useState, useEffect, Fragment } from 'react';
import { WalletButton, WalletStatus } from '../wallet';
import { AuthModal } from '../auth/AuthModal';
import { Menu, Transition } from '@headlessui/react';

const tickerData = [
  { symbol: 'BTC', price: 45234.56, change: 2.45 },
  { symbol: 'ETH', price: 3234.78, change: -1.23 },
  { symbol: 'AAPL', price: 178.45, change: 0.87 },
  { symbol: 'TSLA', price: 234.67, change: 3.21 },
  { symbol: 'NVDA', price: 456.89, change: -0.94 },
];

export function Header() {
  const { isOnline } = useUIStore();
  const { user, logout, isAuthenticated } = useAuth();
  const [demoActive, setDemoActive] = useState(isDemoActive());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoActive(isDemoActive());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDemoToggle = () => {
    if (demoActive) {
      stopDemo();
    } else {
      startDemo();
    }
  };

  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      <header className="h-16 border-b border-secondary-700 glass-card backdrop-blur-xl">
        <div className="flex items-center justify-between h-full px-4 max-w-full overflow-hidden">
          {/* Ticker Tape - Hidden on small screens */}
          <div className="flex-1 overflow-hidden hidden lg:block">
            <div className="ticker-tape flex items-center space-x-6">
              {tickerData.map((item) => (
                <div key={item.symbol} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="text-white font-medium text-sm">{item.symbol}</span>
                  <span className="text-secondary-200 text-sm">{formatCurrency(item.price)}</span>
                  <span className={`text-xs ${
                    item.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPercentage(item.change)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search - Hidden on mobile */}
            <div className="relative hidden md:block">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-48 bg-secondary-800/50 border border-secondary-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            {/* Demo Controls */}
            <button 
              onClick={handleDemoToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                demoActive 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                  : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 border border-primary-500/30'
              }`}
            >
              {demoActive ? (
                <>
                  <StopIcon className="w-4 h-4" />
                  Stop Demo
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Start Demo
                </>
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-secondary-800/50">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full animate-pulse"></span>
            </button>

            {/* Wallet Status */}
            <WalletStatus />

            {/* Connection Status */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-secondary-800/30 border border-secondary-700">
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-400' : 'bg-red-400'
              } animate-pulse`}></div>
              <span className="text-sm text-secondary-300">
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>

            {/* User Menu & Wallet */}
            <div className="flex items-center space-x-3">
              {/* Wallet Button */}
              <WalletButton />

              {/* User Authentication */}
              {isAuthenticated && user ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-800/50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center ring-2 ring-primary-500/30">
                        <span className="text-white text-sm font-medium">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronDownIcon className="h-4 w-4 text-secondary-400" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-secondary-800 border border-secondary-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="p-1">
                        <div className="px-3 py-2 text-sm text-secondary-300 border-b border-secondary-700">
                          <div className="font-medium text-white">{user.email}</div>
                          {user.walletAddresses && user.walletAddresses.length > 0 && (
                            <div className="text-xs text-secondary-400 truncate">
                              {user.walletAddresses[0]}
                            </div>
                          )}
                        </div>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-secondary-700' : ''
                              } group flex w-full items-center rounded-md px-3 py-2 text-sm text-secondary-300 hover:text-white`}
                            >
                              <UserIcon className="mr-2 h-4 w-4" />
                              Profile
                            </button>
                          )}
                        </Menu.Item>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-secondary-700' : ''
                              } group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-400 hover:text-red-300`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
