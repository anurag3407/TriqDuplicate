import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import WalletContextProvider from './contexts/WalletContext';
import { WalletAuthIntegration } from './components/wallet';
import App from './App';

const AppWithProviders: React.FC = () => {
  return (
    <AuthProvider>
      <WalletContextProvider>
        <WalletAuthIntegration>
          <App />
          {/* Global Toast Configuration */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(31, 41, 55, 0.95)',
                color: '#f9fafb',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                backdropFilter: 'blur(16px)',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                },
              },
            }}
          />
        </WalletAuthIntegration>
      </WalletContextProvider>
    </AuthProvider>
  );
};

export default AppWithProviders;
