import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, SignalIcon } from '@heroicons/react/24/outline';

interface WalletStatusProps {
  className?: string;
}

const WalletStatus: React.FC<WalletStatusProps> = ({ className = '' }) => {
  const { connection } = useConnection();
  const { publicKey, connected, connecting } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }

    const getBalance = async () => {
      try {
        setIsLoading(true);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Failed to get balance:', error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    getBalance();

    // Subscribe to account changes
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
      }
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey, connected]);

  if (connecting) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center space-x-2 text-yellow-400 ${className}`}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent" />
        <span className="text-sm">Connecting wallet...</span>
      </motion.div>
    );
  }

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center space-x-2 text-gray-500 ${className}`}
      >
        <XCircleIcon className="w-4 h-4" />
        <span className="text-sm">Wallet not connected</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center space-x-3 ${className}`}
      >
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">Connected</span>
        </div>
        
        <div className="h-4 w-px bg-gray-600" />
        
        <div className="flex items-center space-x-2">
          <SignalIcon className="w-4 h-4 text-blue-400" />
          <div className="text-sm">
            {isLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : balance !== null ? (
              <span className="text-blue-400 font-mono">
                {balance.toFixed(4)} SOL
              </span>
            ) : (
              <span className="text-gray-400">Balance unavailable</span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletStatus;
