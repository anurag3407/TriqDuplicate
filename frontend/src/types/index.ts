// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  timestamp: number;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// AI Signal Types
export interface AISignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-100
  price: number;
  targetPrice?: number;
  stopLoss?: number;
  reasoning: string;
  timestamp: number;
  timeframe: string;
  indicators: string[];
}

export interface AIAnalysis {
  symbol: string;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentiment: number; // -1 to 1
  technicalScore: number; // 0-100
  fundamentalScore?: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  predictions: {
    '1h': number;
    '24h': number;
    '7d': number;
    '30d': number;
  };
}

// Portfolio Types
export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  type: 'LONG' | 'SHORT';
  timestamp: number;
}

export interface Portfolio {
  id: string;
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  availableBalance: number;
  positions: Position[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// Trading Types
export interface Order {
  id: string;
  symbol: string;
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  timestamp: number;
  fillPrice?: number;
  fillQuantity?: number;
}

export interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
  pnl: number;
  pnlPercent: number;
  trades: number;
  winRate: number;
  maxDrawdown: number;
  settings: Record<string, any>;
}

// UI Component Types
export interface ChartConfig {
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  indicators: string[];
  overlays: string[];
  theme: 'light' | 'dark';
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

// Three.js Visualization Types
export interface ThreeJSPoint {
  x: number;
  y: number;
  z: number;
  value: number;
  color?: string;
  size?: number;
}

export interface LiquidityFlowData {
  symbol: string;
  buyVolume: number;
  sellVolume: number;
  netFlow: number;
  points: ThreeJSPoint[];
}

export interface AssetNode {
  id: string;
  symbol: string;
  name: string;
  position: [number, number, number];
  price: number;
  change: number;
  volume: number;
  connections: string[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// State Management Types
export interface AppState {
  user: UserState;
  market: MarketState;
  portfolio: PortfolioState;
  trading: TradingState;
  ui: UIState;
}

export interface UserState {
  isAuthenticated: boolean;
  profile?: UserProfile;
  preferences: UserPreferences;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  notifications: boolean;
  autoTrading: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MarketState {
  watchlist: string[];
  selectedSymbol: string;
  marketData: Record<string, MarketData>;
  chartData: Record<string, CandleData[]>;
  aiSignals: AISignal[];
  isLoading: boolean;
  lastUpdate: number;
}

export interface PortfolioState {
  portfolio: Portfolio | null;
  positions: Position[];
  orders: Order[];
  bots: TradingBot[];
  isLoading: boolean;
}

export interface TradingState {
  activeOrders: Order[];
  orderHistory: Order[];
  executingOrder: boolean;
  selectedOrderType: Order['type'];
}

export interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  chartConfig: ChartConfig;
  notifications: Notification[];
  isOnline: boolean;
}

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}
