import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  MarketData, 
  AISignal, 
  Portfolio, 
  Position, 
  Order,
  UserPreferences,
  ChartConfig 
} from '../types';

// Market Store
interface MarketStore {
  watchlist: string[];
  selectedSymbol: string;
  marketData: Record<string, MarketData>;
  aiSignals: AISignal[];
  isLoading: boolean;
  lastUpdate: number;
  
  // Actions
  setSelectedSymbol: (symbol: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  updateMarketData: (symbol: string, data: MarketData) => void;
  addAISignal: (signal: AISignal) => void;
  setLoading: (loading: boolean) => void;
}

export const useMarketStore = create<MarketStore>()(
  subscribeWithSelector((set) => ({
    watchlist: ['BTC', 'ETH', 'AAPL', 'TSLA', 'NVDA'],
    selectedSymbol: 'BTC',
    marketData: {},
    aiSignals: [],
    isLoading: false,
    lastUpdate: Date.now(),

    setSelectedSymbol: (symbol: string) => set({ selectedSymbol: symbol }),
    
    addToWatchlist: (symbol: string) => set((state) => ({
      watchlist: state.watchlist.includes(symbol) 
        ? state.watchlist 
        : [...state.watchlist, symbol]
    })),
    
    removeFromWatchlist: (symbol: string) => set((state) => ({
      watchlist: state.watchlist.filter(s => s !== symbol)
    })),
    
    updateMarketData: (symbol: string, data: MarketData) => set((state) => ({
      marketData: { ...state.marketData, [symbol]: data },
      lastUpdate: Date.now()
    })),
    
    addAISignal: (signal: AISignal) => set((state) => ({
      aiSignals: [signal, ...state.aiSignals.slice(0, 49)] // Keep last 50 signals
    })),
    
    setLoading: (loading: boolean) => set({ isLoading: loading })
  }))
);

// Portfolio Store
interface PortfolioStore {
  portfolio: Portfolio | null;
  positions: Position[];
  orders: Order[];
  isLoading: boolean;
  isBalanceVisible: boolean;
  
  // Actions
  setPortfolio: (portfolio: Portfolio) => void;
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  removePosition: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setLoading: (loading: boolean) => void;
  toggleBalanceVisibility: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  subscribeWithSelector((set) => ({
    portfolio: null,
    positions: [],
    orders: [],
    isLoading: false,
    isBalanceVisible: true,

    setPortfolio: (portfolio: Portfolio) => set({ portfolio }),
    
    addPosition: (position: Position) => set((state) => ({
      positions: [...state.positions, position]
    })),
    
    updatePosition: (id: string, updates: Partial<Position>) => set((state) => ({
      positions: state.positions.map(pos => 
        pos.id === id ? { ...pos, ...updates } : pos
      )
    })),
    
    removePosition: (id: string) => set((state) => ({
      positions: state.positions.filter(pos => pos.id !== id)
    })),
    
    addOrder: (order: Order) => set((state) => ({
      orders: [order, ...state.orders]
    })),
    
    updateOrder: (id: string, updates: Partial<Order>) => set((state) => ({
      orders: state.orders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    })),
    
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    
    toggleBalanceVisibility: () => set((state) => ({
      isBalanceVisible: !state.isBalanceVisible
    }))
  }))
);

// UI Store
interface UIStore {
  sidebarOpen: boolean;
  activeTab: string;
  chartConfig: ChartConfig;
  theme: 'light' | 'dark';
  notifications: any[];
  isOnline: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  updateChartConfig: (config: Partial<ChartConfig>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  setOnlineStatus: (online: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  subscribeWithSelector((set) => ({
    sidebarOpen: true,
    activeTab: 'dashboard',
    chartConfig: {
      timeframe: '1h',
      indicators: ['SMA', 'RSI'],
      overlays: [],
      theme: 'dark'
    },
    theme: 'dark',
    notifications: [],
    isOnline: navigator.onLine,

    toggleSidebar: () => set((state) => ({ 
      sidebarOpen: !state.sidebarOpen 
    })),
    
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    
    setActiveTab: (tab: string) => set({ activeTab: tab }),
    
    updateChartConfig: (config: Partial<ChartConfig>) => set((state) => ({
      chartConfig: { ...state.chartConfig, ...config }
    })),
    
    setTheme: (theme: 'light' | 'dark') => set({ theme }),
    
    addNotification: (notification: any) => set((state) => ({
      notifications: [notification, ...state.notifications]
    })),
    
    removeNotification: (id: string) => set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
    
    setOnlineStatus: (online: boolean) => set({ isOnline: online })
  }))
);

// User Store
interface UserStore {
  isAuthenticated: boolean;
  profile: any | null;
  preferences: UserPreferences;
  
  // Actions
  login: (profile: any) => void;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserStore>()(
  subscribeWithSelector((set) => ({
    isAuthenticated: false,
    profile: null,
    preferences: {
      theme: 'dark',
      currency: 'USD',
      notifications: true,
      autoTrading: false,
      riskLevel: 'MEDIUM'
    },

    login: (profile: any) => set({ 
      isAuthenticated: true, 
      profile 
    }),
    
    logout: () => set({ 
      isAuthenticated: false, 
      profile: null 
    }),
    
    updatePreferences: (preferences: Partial<UserPreferences>) => set((state) => ({
      preferences: { ...state.preferences, ...preferences }
    }))
  }))
);

// Combined store hook for easier access
export const useStore = () => ({
  market: useMarketStore(),
  portfolio: usePortfolioStore(),
  ui: useUIStore(),
  user: useUserStore()
});

// Selectors for better performance
export const selectMarketData = (symbol: string) => 
  useMarketStore(state => state.marketData[symbol]);

export const selectWatchlist = () => 
  useMarketStore(state => state.watchlist);

export const selectPositions = () => 
  usePortfolioStore(state => state.positions);

export const selectCurrentTheme = () => 
  useUIStore(state => state.theme);

// Store persistence
const STORAGE_KEY = 'triq-trading-app';

// Save state to localStorage
export const saveToStorage = () => {
  try {
    const state = {
      watchlist: useMarketStore.getState().watchlist,
      preferences: useUserStore.getState().preferences,
      chartConfig: useUIStore.getState().chartConfig,
      theme: useUIStore.getState().theme,
      sidebarOpen: useUIStore.getState().sidebarOpen
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

// Load state from localStorage
export const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      
      // Restore watchlist
      if (state.watchlist) {
        useMarketStore.setState({ watchlist: state.watchlist });
      }
      
      // Restore preferences
      if (state.preferences) {
        useUserStore.setState({ preferences: state.preferences });
      }
      
      // Restore UI settings
      if (state.chartConfig) {
        useUIStore.setState({ chartConfig: state.chartConfig });
      }
      
      if (state.theme) {
        useUIStore.setState({ theme: state.theme });
      }
      
      if (typeof state.sidebarOpen === 'boolean') {
        useUIStore.setState({ sidebarOpen: state.sidebarOpen });
      }
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
};

// Auto-save on state changes
useMarketStore.subscribe(
  (state) => state.watchlist,
  () => saveToStorage()
);

useUserStore.subscribe(
  (state) => state.preferences,
  () => saveToStorage()
);

useUIStore.subscribe(
  (state) => state.chartConfig,
  () => saveToStorage()
);

useUIStore.subscribe(
  (state) => state.theme,
  () => saveToStorage()
);

useUIStore.subscribe(
  (state) => state.sidebarOpen,
  () => saveToStorage()
);
