// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const http = require('http');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const tradingRoutes = require('./routes/trading');
const aiRoutes = require('./routes/ai');
const defiRoutes = require('./routes/defi');

// Import services
const WebSocketService = require('./services/websocket');
const AIService = require('./services/ai');
const PriceService = require('./services/price');

const app = express();
const server = http.createServer(app);

// Initialize services
const aiService = new AIService();
const priceService = new PriceService();
const wsService = new WebSocketService(server);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make services available to routes
app.use((req, res, next) => {
  req.services = {
    ai: aiService,
    price: priceService,
    websocket: wsService
  };
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      websocket: wsService.getStats(),
      priceService: 'active',
      aiService: 'active'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/defi', defiRoutes);

// Start price streaming service
priceService.startPriceStreaming();

// Set up price update broadcasting via WebSocket
priceService.subscribeToPriceUpdates('BTC', (symbol, data) => {
  wsService.broadcastPriceUpdate(symbol, data);
});
priceService.subscribeToPriceUpdates('ETH', (symbol, data) => {
  wsService.broadcastPriceUpdate(symbol, data);
});
priceService.subscribeToPriceUpdates('SOL', (symbol, data) => {
  wsService.broadcastPriceUpdate(symbol, data);
});

// AI signal broadcasting
setInterval(async () => {
  try {
    const btcSignal = await aiService.generateLSTMSignals('BTC');
    wsService.broadcastAISignal(btcSignal);
    
    const ethSignal = await aiService.generateLSTMSignals('ETH');
    wsService.broadcastAISignal(ethSignal);
  } catch (error) {
    console.error('AI signal broadcast error:', error);
  }
}, 60000); // Every minute

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`
🚀 AI Trading Platform Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on port ${PORT}
🌐 API Base URL: http://localhost:${PORT}/api
🔗 WebSocket URL: ws://localhost:${PORT}
🗄️  Database: ${process.env.NODE_ENV === 'production' ? 'MongoDB Atlas' : 'Local MongoDB'}
� Environment: ${process.env.NODE_ENV || 'development'}

📋 Available API Endpoints:
   🔐 /api/auth/* - Authentication & User Management
   💼 /api/portfolio/* - Portfolio Management
   📈 /api/trading/* - Trading Operations
   🤖 /api/ai/* - AI Signals & Analysis
   🏦 /api/defi/* - DeFi & Solana Integration
   💡 /api/health - Health Check

🎯 Services Status:
   ✅ WebSocket Service: Active
   ✅ Price Service: Active  
   ✅ AI Service: Active
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to accept connections! 🎯
  `);
});

module.exports = { app, server };
