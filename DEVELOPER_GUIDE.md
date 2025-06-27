# TRIQ AI Trading Platform - Developer Guide

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- MongoDB (for backend)

### Quick Setup

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd triq-ai-platform
   npm run install:all
   ```

2. **Environment Configuration**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env
   
   # Backend
   cp backend/.env.example backend/.env
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## 📁 Project Architecture

### Frontend Structure
```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── types.ts     # Auth component types
│   │   │   └── index.ts     # Barrel exports
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── types.ts     # Layout component types
│   │   │   └── index.ts     # Barrel exports
│   │   ├── wallet/          # Solana wallet components
│   │   │   ├── WalletButton.tsx
│   │   │   ├── WalletStatus.tsx
│   │   │   ├── WalletAuthIntegration.tsx
│   │   │   └── index.ts     # Barrel exports
│   │   └── index.ts         # Main component exports
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication context
│   │   ├── WalletContext.tsx # Solana wallet context
│   │   └── index.ts         # Context exports
│   ├── pages/               # Page components
│   │   ├── WalletDemo.tsx
│   │   └── ...
│   ├── stores/              # State management (Zustand)
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   │   ├── demoController.ts
│   │   └── index.ts         # Utility exports
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component
│   ├── AppWithProviders.tsx # App with context providers
│   └── main.tsx             # Application entry point
├── public/                  # Static public assets
├── package.json             # Frontend dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── .env.example             # Environment variables template
```

### Backend Structure
```
backend/
├── config/                  # Configuration files
├── middleware/              # Express middleware
├── models/                  # Database models
├── routes/                  # API routes
├── services/                # Business logic services
├── package.json             # Backend dependencies
├── server.js                # Server entry point
└── .env.example             # Environment variables template
```

## 🛠️ Development Workflow

### Adding New Components

1. **Create Component File**
   ```typescript
   // frontend/src/components/[category]/ComponentName.tsx
   import React from 'react';
   
   interface ComponentNameProps {
     // Define props here
   }
   
   const ComponentName: React.FC<ComponentNameProps> = ({ /* props */ }) => {
     return (
       <div>
         {/* Component JSX */}
       </div>
     );
   };
   
   export default ComponentName;
   ```

2. **Add Type Definitions**
   ```typescript
   // frontend/src/components/[category]/types.ts
   export interface ComponentNameProps {
     // Define props interface
   }
   ```

3. **Update Index File**
   ```typescript
   // frontend/src/components/[category]/index.ts
   export { default as ComponentName } from './ComponentName';
   export type { ComponentNameProps } from './types';
   ```

### State Management Best Practices

1. **Use Zustand for Global State**
   ```typescript
   // frontend/src/stores/useExampleStore.ts
   import { create } from 'zustand';
   
   interface ExampleState {
     data: any[];
     loading: boolean;
     error: string | null;
     fetchData: () => Promise<void>;
   }
   
   export const useExampleStore = create<ExampleState>((set) => ({
     data: [],
     loading: false,
     error: null,
     fetchData: async () => {
       set({ loading: true });
       try {
         // Fetch logic
         set({ data: [], loading: false });
       } catch (error) {
         set({ error: error.message, loading: false });
       }
     }
   }));
   ```

2. **Use React Context for Component Trees**
   ```typescript
   // frontend/src/contexts/ExampleContext.tsx
   import React, { createContext, useContext, useReducer } from 'react';
   
   interface ExampleContextType {
     state: any;
     dispatch: React.Dispatch<any>;
   }
   
   const ExampleContext = createContext<ExampleContextType | undefined>(undefined);
   
   export const useExample = () => {
     const context = useContext(ExampleContext);
     if (!context) {
       throw new Error('useExample must be used within ExampleProvider');
     }
     return context;
   };
   
   export const ExampleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     // Provider logic
     return (
       <ExampleContext.Provider value={value}>
         {children}
       </ExampleContext.Provider>
     );
   };
   ```

### Styling Guidelines

1. **Use Tailwind Utility Classes**
   ```typescript
   // Preferred approach
   <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
     <span className="text-white font-medium">Content</span>
   </div>
   ```

2. **Create Reusable Utility Functions**
   ```typescript
   // frontend/src/utils/index.ts
   import { clsx, type ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';
   
   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

3. **Use Component Variants**
   ```typescript
   import { cva } from 'class-variance-authority';
   
   const buttonVariants = cva(
     'inline-flex items-center justify-center rounded-md text-sm font-medium',
     {
       variants: {
         variant: {
           default: 'bg-blue-600 text-white hover:bg-blue-700',
           destructive: 'bg-red-600 text-white hover:bg-red-700',
         },
         size: {
           default: 'h-10 px-4 py-2',
           sm: 'h-9 px-3',
           lg: 'h-11 px-8',
         },
       },
     }
   );
   ```

### Testing Strategy

1. **Component Testing**
   ```typescript
   // frontend/src/components/__tests__/ComponentName.test.tsx
   import { render, screen } from '@testing-library/react';
   import ComponentName from '../ComponentName';
   
   describe('ComponentName', () => {
     it('renders correctly', () => {
       render(<ComponentName />);
       expect(screen.getByText('Expected Text')).toBeInTheDocument();
     });
   });
   ```

2. **Integration Testing**
   ```typescript
   // backend/tests/integration/api.test.js
   const request = require('supertest');
   const app = require('../../server');
   
   describe('API Endpoints', () => {
     it('should return 200 for health check', async () => {
       const response = await request(app).get('/api/health');
       expect(response.status).toBe(200);
     });
   });
   ```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for development/production
   - Validate required environment variables at startup

2. **API Security**
   - Use JWT tokens for authentication
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS in production

3. **Frontend Security**
   - Sanitize user inputs
   - Use Content Security Policy
   - Avoid storing sensitive data in localStorage

## 📊 Performance Optimization

1. **Frontend Optimization**
   - Use React.memo() for expensive components
   - Implement virtual scrolling for large lists
   - Lazy load routes and components
   - Optimize bundle size with code splitting

2. **Backend Optimization**
   - Use database indexing
   - Implement caching strategies
   - Optimize database queries
   - Use connection pooling

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Deploy using platform-specific commands
```

## 📝 Code Standards

1. **TypeScript Standards**
   - Always use TypeScript for new files
   - Define interfaces for all props and data structures
   - Use strict mode in tsconfig.json

2. **React Standards**
   - Use functional components with hooks
   - Follow naming conventions (PascalCase for components)
   - Use React.FC type for components

3. **Git Standards**
   - Use conventional commit messages
   - Create feature branches from main
   - Squash commits before merging

## 🐛 Debugging

1. **Frontend Debugging**
   - Use React Developer Tools
   - Check browser console for errors
   - Use Vite's built-in error overlay

2. **Backend Debugging**
   - Use Node.js debugger
   - Check server logs
   - Use Postman for API testing

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Solana Web3.js](https://docs.solana.com/developing/clients/javascript-reference)

---

**Happy Coding! 🚀**
