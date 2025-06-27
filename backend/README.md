# AI Trading Platform - Backend API

A comprehensive backend API for an institutional-grade AI-powered trading platform with DeFi integration, real-time data streaming, and advanced authentication.

## 🚀 Features

### Core Features
- **JWT Authentication** - Secure user registration, login, and session management
- **Real-time Data** - WebSocket connections for live price feeds and portfolio updates
- **AI Trading Signals** - LSTM, Transformer, and Sentiment analysis models
- **Portfolio Management** - Advanced analytics, rebalancing, and performance tracking
- **Trading Engine** - Order management, strategy automation, and risk management
- **DeFi Integration** - Solana wallet connection, token swaps, staking, and yield farming

### Technical Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Real-time**: WebSocket (ws library)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Environment**: dotenv configuration

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Global error handling
├── models/
│   └── User.js              # User model with authentication and preferences
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── portfolio.js         # Portfolio management
│   ├── trading.js           # Trading operations
│   ├── ai.js               # AI signals and analysis
│   └── defi.js             # DeFi and Solana integration
├── services/
│   ├── websocket.js         # WebSocket service for real-time updates
│   ├── ai.js               # AI model integration service
│   └── price.js            # Price data service
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
└── server.js              # Main application entry point
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Navigate to the server directory**:
   ```powershell
   cd p:\TriqDuplicate\server
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Environment Configuration**:
   Copy `.env.example` to `.env` and configure:
   ```powershell
   copy .env.example .env
   ```

4. **Configure Environment Variables**:
   Edit `.env` file with your settings:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=8000
   FRONTEND_URL=http://localhost:5173

   # Database
   MONGODB_URI=mongodb://localhost:27017/ai-trading-platform
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-trading-platform

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d

   # API Keys (Optional)
   COINGECKO_API_KEY=your-coingecko-api-key
   AI_MICROSERVICE_URL=http://localhost:5000

   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

5. **Start the server**:
   ```powershell
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `POST /logout` - Logout user

### Portfolio (`/api/portfolio`)
- `GET /` - Get portfolio overview
- `GET /holdings` - Get portfolio holdings
- `GET /performance` - Get performance metrics
- `POST /rebalance` - Rebalance portfolio (Premium)
- `GET /analytics` - Advanced analytics (Premium)
- `POST /alert` - Set portfolio alerts

### Trading (`/api/trading`)
- `GET /markets` - Get market data
- `GET /orderbook/:symbol` - Get order book
- `POST /order` - Place trading order
- `GET /orders` - Get user orders
- `DELETE /order/:orderId` - Cancel order
- `GET /history` - Get trading history
- `POST /strategy` - Create trading strategy (Premium)
- `GET /strategies` - Get user strategies

### AI Analysis (`/api/ai`)
- `GET /signals` - Get AI trading signals
- `GET /sentiment` - Get market sentiment
- `GET /predictions` - Get price predictions (Premium)
- `GET /analysis/:symbol` - Comprehensive analysis (Premium)
- `POST /backtest` - Backtest strategies (Premium)
- `GET /models` - Get AI model performance (Premium)

### DeFi Integration (`/api/defi`)
- `POST /wallet/connect` - Connect Solana wallet
- `GET /wallet/balance` - Get wallet balances
- `GET /tokens` - Get available tokens
- `POST /swap` - Execute token swap
- `GET /pools` - Get liquidity pools
- `POST /stake` - Stake tokens
- `GET /stakes` - Get user stakes
- `GET /analytics` - DeFi analytics

### System (`/api`)
- `GET /health` - Health check and system status

## 🔌 WebSocket Events

### Client to Server
- `auth` - Authenticate WebSocket connection
- `subscribe_prices` - Subscribe to price updates
- `unsubscribe_prices` - Unsubscribe from prices
- `subscribe_portfolio` - Subscribe to portfolio updates
- `unsubscribe_portfolio` - Unsubscribe from portfolio
- `ping` - Connection heartbeat

### Server to Client
- `auth_success` / `auth_error` - Authentication results
- `price_update` - Real-time price updates
- `portfolio_update` - Portfolio value changes
- `ai_signal` - New AI trading signals
- `trade_notification` - Trade execution updates
- `pong` - Heartbeat response

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based authentication with secure token generation
- Password hashing using bcryptjs with salt rounds
- Role-based access control (user, premium, admin)
- Premium feature restrictions

### Security Middleware
- **Helmet**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Request rate limiting per IP
- **Input Validation**: Express Validator for all inputs
- **Error Handling**: Secure error responses

### Data Protection
- Password field exclusion in API responses
- Sensitive data encryption
- Request/response logging
- Environment variable protection

## 🔧 Development

### Available Scripts
```powershell
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm test         # Run tests (when implemented)
npm run lint     # Run ESLint (when configured)
```

### Database Setup
The application will automatically connect to MongoDB on startup. Ensure MongoDB is running:

**Local MongoDB**:
```powershell
# Start MongoDB service
net start MongoDB
```

**MongoDB Atlas**:
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### Testing API Endpoints
Use tools like Postman, Thunder Client, or curl to test endpoints:

```powershell
# Health check
curl http://localhost:8000/api/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure production CORS origins

### Process Management
Consider using PM2 for production:
```powershell
npm install -g pm2
pm2 start server.js --name "ai-trading-api"
pm2 startup
pm2 save
```

## 📊 Monitoring

### Health Check
Monitor application health via `/api/health` endpoint:
- System uptime
- Memory usage
- Service status
- WebSocket connections

### Logging
- Request logging via Morgan
- Error logging with stack traces
- WebSocket connection tracking
- Service status monitoring

## 🔮 Future Enhancements

### Planned Features
- [ ] Redis caching for improved performance
- [ ] Rate limiting per user
- [ ] Email notifications for alerts
- [ ] Advanced AI model integration
- [ ] Solana program interactions
- [ ] Multi-chain DeFi support
- [ ] Advanced risk management
- [ ] Social trading features
- [ ] Copy trading functionality
- [ ] Advanced charting data

### AI Microservices Integration
- Python Flask/FastAPI services for ML models
- LSTM neural networks for price prediction
- Transformer models for market analysis
- NLP sentiment analysis from social media
- Ensemble models for hybrid signals

## 📞 Support

For issues and questions:
1. Check the health endpoint: `GET /api/health`
2. Review server logs for error details
3. Verify environment configuration
4. Ensure database connectivity
5. Check WebSocket connection status

## 📄 License

This project is part of an AI Trading Platform and follows the main project's licensing terms.
