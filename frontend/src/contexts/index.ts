// Context exports
export { default as AuthProvider, useAuth } from './AuthContext';
export { default as WalletContextProvider } from './WalletContext';

// Re-export types
export type { AuthContextType, User } from './AuthContext';
export type { WalletContextProviderProps } from './WalletContext';
