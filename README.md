# TRIQ AI Trading Platform

A cutting-edge AI-powered DeFi trading platform built with modern web technologies and Solana blockchain integration.

## 🏗️ Project Structure

```
triq-ai-platform/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── layout/     # Layout components (Header, Sidebar)
│   │   │   └── wallet/     # Solana wallet components
│   │   ├── contexts/       # React contexts (Auth, Wallet)
│   │   ├── pages/          # Page components
│   │   ├── stores/         # State management (Zustand)
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js + Express backend
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── package.json        # Backend dependencies
└── package.json            # Root workspace configuration
```

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Three.js & React Three Fiber** - 3D visualizations
- **GSAP + Framer Motion** - Advanced animations
- **Solana Wallet Adapter** - Blockchain wallet integration
- **React Query** - Server state management
- **Zustand** - Client state management

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Joi** - Data validation

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd triq-ai-platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

This will start both frontend (port 5173) and backend (port 3001) concurrently.

### Individual Setup

#### Frontend Only
```bash
npm run install:frontend
npm run dev:frontend
```

#### Backend Only
```bash
npm run install:backend
npm run dev:backend
```

## 🛠️ Available Scripts

### Root Level Commands
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run start` - Start the backend in production mode
- `npm run lint` - Run linting on frontend code
- `npm run test` - Run tests for both frontend and backend
- `npm run clean` - Clean node_modules for both projects

### Frontend Commands
- `npm run dev:frontend` - Start frontend dev server
- `npm run build:frontend` - Build frontend for production
- `npm run lint:frontend` - Run ESLint on frontend code
- `npm run test:frontend` - Run frontend tests

### Backend Commands
- `npm run dev:backend` - Start backend dev server with nodemon
- `npm run start:backend` - Start backend in production mode
- `npm run test:backend` - Run backend tests

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_SOLANA_NETWORK=devnet
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/triq-ai
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5173
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#0066FF)
- **Secondary**: Emerald Green (#00D4AA)
- **Background**: Dark Navy (#0A0E1A)
- **Surface**: Dark Gray (#1A1D2E)
- **Text**: Light Gray (#E2E8F0)

### Typography
- **Headings**: Inter, system-ui
- **Body**: Inter, sans-serif
- **Code**: JetBrains Mono, monospace

## 🏦 Features

### Core Features
- ✅ User authentication and registration
- ✅ Solana wallet integration
- ✅ Real-time market data visualization
- ✅ AI-powered trading signals
- ✅ Portfolio management
- ✅ 3D data visualizations
- ✅ Dark theme with glassmorphism effects

### Trading Features
- Portfolio tracking
- Market analysis
- Risk management
- Performance analytics
- Automated trading (AI-driven)

### Technical Features
- WebSocket real-time updates
- Responsive design
- Progressive Web App (PWA)
- Performance optimizations
- Error boundaries and fallbacks

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

## 📈 Performance

- **Frontend**: Optimized with code splitting, lazy loading, and modern bundling
- **Backend**: Efficient API design with caching and rate limiting
- **Database**: Optimized queries and indexing
- **Real-time**: WebSocket connections for live data

## 🔒 Security

- JWT-based authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build:frontend
# Deploy the frontend/dist folder
```

### Backend (Railway/Heroku)
```bash
# Deploy the backend folder to your hosting platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email team@triq.ai or join our Discord community.

---

**Built with ❤️ by the TRIQ AI Team**
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
