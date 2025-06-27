# TRIQ AI Trading Platform - Project Structure

```
triq-ai-platform/
├── 📁 frontend/                    # React + TypeScript Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI Components
│   │   │   ├── 📁 auth/          # Authentication Components
│   │   │   │   ├── 📄 LoginForm.tsx
│   │   │   │   ├── 📄 RegisterForm.tsx
│   │   │   │   ├── 📄 AuthModal.tsx
│   │   │   │   ├── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 layout/        # Layout Components
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   ├── 📄 Sidebar.tsx
│   │   │   │   ├── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 wallet/        # Solana Wallet Components
│   │   │   │   ├── 📄 WalletButton.tsx
│   │   │   │   ├── 📄 WalletStatus.tsx
│   │   │   │   ├── 📄 WalletAuthIntegration.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📄 index.ts       # Main component barrel exports
│   │   ├── 📁 contexts/          # React Context Providers
│   │   │   ├── 📄 AuthContext.tsx
│   │   │   ├── 📄 WalletContext.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 pages/             # Page Components
│   │   │   ├── 📄 WalletDemo.tsx
│   │   │   └── 📄 ...
│   │   ├── 📁 stores/            # Zustand State Management
│   │   │   └── 📄 ...
│   │   ├── 📁 types/             # TypeScript Type Definitions
│   │   │   └── 📄 index.ts
│   │   ├── 📁 utils/             # Utility Functions
│   │   │   ├── 📄 demoController.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 assets/            # Static Assets
│   │   ├── 📄 App.tsx            # Main Application Component
│   │   ├── 📄 AppWithProviders.tsx # App with Context Providers
│   │   ├── 📄 main.tsx           # Application Entry Point
│   │   └── 📄 vite-env.d.ts      # Vite Environment Types
│   ├── 📁 public/                # Static Public Assets
│   ├── 📄 package.json           # Frontend Dependencies
│   ├── 📄 vite.config.ts         # Vite Configuration
│   ├── 📄 tailwind.config.js     # Tailwind CSS Configuration
│   ├── 📄 postcss.config.js      # PostCSS Configuration
│   ├── 📄 eslint.config.js       # ESLint Configuration
│   ├── 📄 tsconfig.json          # TypeScript Configuration
│   ├── 📄 tsconfig.app.json      # App TypeScript Configuration
│   ├── 📄 tsconfig.node.json     # Node TypeScript Configuration
│   ├── 📄 index.html             # HTML Entry Point
│   └── 📄 .env.example           # Environment Variables Template
│
├── 📁 backend/                     # Node.js + Express Backend API
│   ├── 📁 config/                # Configuration Files
│   ├── 📁 middleware/            # Express Middleware
│   ├── 📁 models/                # Database Models (MongoDB)
│   ├── 📁 routes/                # API Route Handlers
│   ├── 📁 services/              # Business Logic Services
│   ├── 📄 server.js              # Server Entry Point
│   ├── 📄 package.json           # Backend Dependencies
│   ├── 📄 .env.example           # Environment Variables Template
│   └── 📄 README.md              # Backend Documentation
│
├── 📁 .github/                     # GitHub Configuration
├── 📁 .vscode/                     # VS Code Configuration
├── 📁 node_modules/                # Root Dependencies
├── 📄 package.json                 # Root Workspace Configuration
├── 📄 package-lock.json            # Dependency Lock File
├── 📄 .gitignore                   # Git Ignore Rules
├── 📄 README.md                    # Main Project Documentation
├── 📄 DEVELOPER_GUIDE.md           # Development Guidelines
└── 📄 PROJECT_STRUCTURE.md         # This File
```

## 🏗️ Architecture Overview

### Frontend Architecture
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with dark theme
- **State Management**: Zustand + React Context
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: GSAP + Framer Motion
- **Blockchain**: Solana Wallet Adapter
- **HTTP Client**: Axios + React Query

### Backend Architecture
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.io + WebSocket
- **Validation**: Joi + express-validator
- **Security**: Helmet + CORS + Rate Limiting

### Key Design Patterns

1. **Barrel Exports**: Each component folder has an `index.ts` for clean imports
2. **Type Safety**: Comprehensive TypeScript types for all components and APIs
3. **Context Pattern**: React Context for authentication and wallet state
4. **Custom Hooks**: Reusable logic in custom React hooks
5. **Service Layer**: Business logic separated from controllers
6. **Middleware Pattern**: Express middleware for cross-cutting concerns

### Development Principles

1. **Separation of Concerns**: Clear separation between UI, business logic, and data
2. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
3. **SOLID Principles**: Single responsibility, dependency inversion
4. **Clean Code**: Descriptive naming, small functions, clear structure
5. **Type Safety**: Comprehensive TypeScript usage
6. **Error Handling**: Proper error boundaries and validation

### Testing Strategy

1. **Unit Tests**: Component and utility function testing
2. **Integration Tests**: API endpoint testing
3. **E2E Tests**: User journey testing
4. **Type Checking**: TypeScript compile-time checks
5. **Linting**: ESLint for code quality

### Performance Optimizations

1. **Code Splitting**: Lazy loading of routes and heavy components
2. **Bundle Optimization**: Tree shaking and dynamic imports
3. **Image Optimization**: Proper image formats and lazy loading
4. **Database Optimization**: Indexed queries and connection pooling
5. **Caching**: Strategic caching at multiple levels

### Security Measures

1. **Authentication**: JWT-based secure authentication
2. **Authorization**: Role-based access control
3. **Input Validation**: Comprehensive input sanitization
4. **HTTPS**: Secure transport layer
5. **Environment Variables**: Secure configuration management

---

**This structure follows industry best practices and modern web development standards.**
