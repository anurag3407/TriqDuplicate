import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { WalletIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface WalletButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const { wallet, publicKey, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      // Already connected, show wallet menu
      return;
    }
    setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 focus:ring-gray-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-xl',
    };

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  };

  if (connecting) {
    return (
      <button className={getButtonClasses()} disabled>
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
        Connecting...
      </button>
    );
  }

  if (connected && publicKey) {
    const base58 = publicKey.toBase58();
    const shortAddress = `${base58.slice(0, 4)}...${base58.slice(-4)}`;

    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className={getButtonClasses()}>
          <div className="flex items-center space-x-2">
            {wallet?.adapter.icon && (
              <img
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                className="w-5 h-5 rounded-full"
              />
            )}
            <span className="hidden sm:inline">{wallet?.adapter.name}</span>
            <span className="font-mono text-xs bg-black/20 px-2 py-1 rounded">
              {shortAddress}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded-lg bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-600">
            <div className="px-4 py-3">
              <p className="text-sm text-gray-400">Connected as</p>
              <p className="text-sm font-medium text-white truncate">
                {wallet?.adapter.name}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {base58}
              </p>
            </div>
            
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigator.clipboard.writeText(base58)}
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-300'
                    } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                  >
                    Copy Address
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDisconnect}
                    className={`${
                      active ? 'bg-red-600 text-white' : 'text-red-400'
                    } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                  >
                    Disconnect
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className={getButtonClasses()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <WalletIcon className="w-5 h-5 mr-2" />
      Connect Wallet
    </motion.button>
  );
};

export default WalletButton;
