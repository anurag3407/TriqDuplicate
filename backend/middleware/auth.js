const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user has premium subscription
const requirePremium = async (req, res, next) => {
  try {
    if (!req.user.subscription || req.user.subscription.plan === 'free') {
      return res.status(403).json({ 
        message: 'Premium subscription required for this feature' 
      });
    }

    if (new Date(req.user.subscription.expiresAt) < new Date()) {
      return res.status(403).json({ 
        message: 'Subscription expired. Please renew to access this feature' 
      });
    }

    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, requirePremium, requireAdmin };
