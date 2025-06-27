import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface WalletAuthIntegrationProps {
  children: React.ReactNode;
}

const WalletAuthIntegration: React.FC<WalletAuthIntegrationProps> = ({ children }) => {
  const { publicKey, connected, wallet } = useWallet();
  const { user, linkWallet } = useAuth();
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const handleWalletConnection = async () => {
      if (connected && publicKey && user && wallet) {
        // Check if this wallet is already linked to the user
        const walletAddress = publicKey.toBase58();
        
        if (!user.walletAddresses?.includes(walletAddress)) {
          // Ask user if they want to link this wallet
          const shouldLink = await new Promise<boolean>((resolve) => {
            toast.custom(
              (t) => (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl max-w-md"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {wallet.adapter.icon && (
                        <img
                          src={wallet.adapter.icon}
                          alt={wallet.adapter.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white mb-1">
                        Link Wallet to Account?
                      </h3>
                      <p className="text-xs text-gray-400 mb-3">
                        Connect your {wallet.adapter.name} wallet to enable DeFi trading features.
                      </p>
                      <p className="text-xs font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded mb-3">
                        {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                          }}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                        >
                          Link Wallet
                        </button>
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                          }}
                          className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition-colors"
                        >
                          Not Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ),
              {
                duration: 10000,
                position: 'top-right',
              }
            );
          });

          if (shouldLink) {
            setIsLinking(true);
            try {
              await linkWallet(walletAddress, wallet.adapter.name);
              toast.success('Wallet linked successfully!');
            } catch (error) {
              console.error('Failed to link wallet:', error);
              toast.error('Failed to link wallet. Please try again.');
            } finally {
              setIsLinking(false);
            }
          }
        }
      }
    };

    handleWalletConnection();
  }, [connected, publicKey, user, wallet, linkWallet]);

  useEffect(() => {
    // Handle wallet disconnection
    if (!connected && user?.walletAddresses?.length) {
      // Optionally show a message about wallet disconnection
      toast('Wallet disconnected', {
        icon: '🔌',
        duration: 3000,
      });
    }
  }, [connected, user?.walletAddresses]);

  return (
    <>
      {children}
      {isLinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm mx-4"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Linking Wallet
              </h3>
              <p className="text-gray-400 text-sm">
                Please wait while we link your wallet to your account...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default WalletAuthIntegration;
