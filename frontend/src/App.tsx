import { Suspense, useEffect } from 'react';
import { useMarketStore, useUIStore, loadFromStorage } from './stores';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { Portfolio } from './components/widgets/Portfolio';
import { Trading } from './components/widgets/Trading';
import { Analytics } from './components/widgets/Analytics';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function App() {
  const { activeTab, sidebarOpen, theme } = useUIStore();
  const { setLoading } = useMarketStore();

  useEffect(() => {
    // Load saved state from localStorage
    loadFromStorage();
    
    // Set up online/offline detection
    const handleOnline = () => useUIStore.getState().setOnlineStatus(true);
    const handleOffline = () => useUIStore.getState().setOnlineStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initialize demo data
    setLoading(false);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setLoading]);

  const renderPage = () => {
    switch (activeTab) {
      case 'portfolio':
        return <Portfolio />;
      case 'trading':
        return <Trading />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gradient-to-br from-secondary-950 via-secondary-900 to-secondary-800 ${theme}`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          } overflow-hidden`}>
            {/* Header */}
            <Header />
            
            {/* Page Content */}
            <main className="flex-1 overflow-auto p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <Suspense fallback={<LoadingScreen />}>
                  {renderPage()}
                </Suspense>
              </div>
            </main>
          </div>
        </div>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(56, 32, 57, 0.95)',
              color: '#f8fafc',
              border: '1px solid rgba(246, 56, 220, 0.3)',
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
