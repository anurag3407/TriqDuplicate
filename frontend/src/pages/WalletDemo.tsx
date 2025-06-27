import React from 'react';
import { motion } from 'framer-motion';
import { WalletButton, WalletStatus } from '../components/wallet';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletDemo: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Solana Wallet Integration
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Connect your Solana wallet to access DeFi trading features and manage your portfolio
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Authentication Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${isAuthenticated ? 'bg-green-400' : 'bg-red-400'}`} />
                Account Status
              </h3>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Name:</span> {user.profile.firstName} {user.profile.lastName}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Role:</span> {user.role}
                  </p>
                  {user.walletAddresses && user.walletAddresses.length > 0 && (
                    <div>
                      <span className="text-gray-500">Linked Wallets:</span>
                      <ul className="mt-1 space-y-1">
                        {user.walletAddresses.map((address, index) => (
                          <li key={index} className="text-sm font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                            {address.slice(0, 8)}...{address.slice(-8)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">Not signed in to account</p>
              )}
            </motion.div>

            {/* Wallet Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
                Wallet Status
              </h3>
              <WalletStatus />
              {connected && publicKey && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-500 text-sm mb-1">Connected Address:</p>
                  <p className="text-xs font-mono text-gray-300 bg-gray-700/50 px-2 py-1 rounded break-all">
                    {publicKey.toBase58()}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <div className="space-x-4">
              <WalletButton variant="primary" size="lg" />
              {!isAuthenticated && (
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Sign In to Account
                </button>
              )}
            </div>
            
            {connected && !isAuthenticated && (
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  💡 Sign in to your account to link your wallet and access trading features
                </p>
              </div>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                title: 'Portfolio Management',
                description: 'Track your Solana assets and DeFi positions in real-time',
                enabled: connected && isAuthenticated,
              },
              {
                title: 'Automated Trading',
                description: 'Set up AI-powered trading strategies for optimal returns',
                enabled: connected && isAuthenticated,
              },
              {
                title: 'Risk Analysis',
                description: 'Advanced risk assessment tools for safer trading',
                enabled: connected && isAuthenticated,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-200 ${
                  feature.enabled
                    ? 'bg-green-900/20 border-green-600/30'
                    : 'bg-gray-800/30 border-gray-700'
                }`}
              >
                <h4 className={`font-semibold mb-2 ${
                  feature.enabled ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
                {!feature.enabled && (
                  <p className="text-xs text-gray-500 mt-2">
                    Requires wallet connection and account sign-in
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletDemo;
