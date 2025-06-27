const axios = require('axios');

class AIService {
  constructor() {
    this.aiMicroserviceUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:5000';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generate trading signals using LSTM model
  async generateLSTMSignals(symbol, timeframe = '4h') {
    try {
      const cacheKey = `lstm_${symbol}_${timeframe}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Mock LSTM service call - replace with actual AI microservice
      const response = await this.mockAIServiceCall('lstm/signals', {
        symbol,
        timeframe,
        lookback: 100
      });

      const signal = {
        id: `lstm_${Date.now()}`,
        symbol,
        type: response.prediction > 0.5 ? 'buy' : 'sell',
        confidence: Math.abs(response.prediction - 0.5) * 2,
        timeframe,
        price: response.currentPrice,
        targetPrice: response.targetPrice,
        stopLoss: response.stopLoss,
        reason: 'LSTM neural network prediction',
        model: 'LSTM-v2.1',
        indicators: response.technicalIndicators,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + this.getTimeframeMs(timeframe))
      };

      this.setCache(cacheKey, signal);
      return signal;
    } catch (error) {
      console.error('LSTM signal generation error:', error);
      throw new Error('Failed to generate LSTM signal');
    }
  }

  // Analyze market sentiment using NLP
  async analyzeSentiment(symbol = null, sources = ['twitter', 'reddit', 'news']) {
    try {
      const cacheKey = `sentiment_${symbol || 'market'}_${sources.join(',')}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Mock sentiment analysis - replace with actual NLP service
      const response = await this.mockAIServiceCall('nlp/sentiment', {
        symbol,
        sources,
        timeframe: '24h'
      });

      const sentiment = {
        symbol: symbol || 'market',
        overall: response.overallSentiment,
        sources: response.sourceSentiments,
        keywords: response.trendingKeywords,
        confidence: response.confidence,
        volume: response.mentionVolume,
        lastUpdated: new Date()
      };

      this.setCache(cacheKey, sentiment, 10 * 60 * 1000); // Cache for 10 minutes
      return sentiment;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  // Generate hybrid signals combining multiple models
  async generateHybridSignals(symbol, models = ['lstm', 'transformer', 'sentiment']) {
    try {
      const signals = await Promise.all([
        models.includes('lstm') ? this.generateLSTMSignals(symbol) : null,
        models.includes('transformer') ? this.generateTransformerSignals(symbol) : null,
        models.includes('sentiment') ? this.generateSentimentSignals(symbol) : null
      ]);

      const validSignals = signals.filter(s => s !== null);
      
      if (validSignals.length === 0) {
        throw new Error('No valid signals generated');
      }

      // Combine signals using weighted average
      const hybridSignal = this.combineSignals(validSignals, symbol);
      return hybridSignal;
    } catch (error) {
      console.error('Hybrid signal generation error:', error);
      throw new Error('Failed to generate hybrid signal');
    }
  }

  // Generate transformer-based signals
  async generateTransformerSignals(symbol, timeframe = '4h') {
    try {
      const response = await this.mockAIServiceCall('transformer/signals', {
        symbol,
        timeframe,
        contextLength: 512
      });

      return {
        id: `transformer_${Date.now()}`,
        symbol,
        type: response.prediction > 0.6 ? 'buy' : response.prediction < 0.4 ? 'sell' : 'hold',
        confidence: Math.max(Math.abs(response.prediction - 0.5) * 2, 0.5),
        timeframe,
        price: response.currentPrice,
        targetPrice: response.targetPrice,
        stopLoss: response.stopLoss,
        reason: 'Transformer attention mechanism analysis',
        model: 'Transformer-v1.5',
        attention: response.attentionWeights,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + this.getTimeframeMs(timeframe))
      };
    } catch (error) {
      console.error('Transformer signal error:', error);
      return null;
    }
  }

  // Generate sentiment-based signals
  async generateSentimentSignals(symbol) {
    try {
      const sentiment = await this.analyzeSentiment(symbol);
      
      let type = 'hold';
      let confidence = 0.5;
      
      if (sentiment.overall > 0.7) {
        type = 'buy';
        confidence = sentiment.overall;
      } else if (sentiment.overall < 0.3) {
        type = 'sell';
        confidence = 1 - sentiment.overall;
      }

      return {
        id: `sentiment_${Date.now()}`,
        symbol,
        type,
        confidence,
        timeframe: '1h',
        reason: `Market sentiment: ${sentiment.overall > 0.5 ? 'positive' : 'negative'}`,
        model: 'Sentiment-NLP-v1.0',
        sentimentData: sentiment,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      };
    } catch (error) {
      console.error('Sentiment signal error:', error);
      return null;
    }
  }

  // Backtest strategy performance
  async backtestStrategy(strategy, symbol, startDate, endDate, initialCapital = 10000) {
    try {
      const response = await this.mockAIServiceCall('backtest/run', {
        strategy,
        symbol,
        startDate,
        endDate,
        initialCapital
      });

      return {
        strategy: strategy.name,
        symbol,
        period: { start: startDate, end: endDate },
        performance: response.performance,
        trades: response.trades,
        equity: response.equityCurve,
        metrics: response.riskMetrics,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Backtest error:', error);
      throw new Error('Failed to run backtest');
    }
  }

  // Get AI model performance metrics
  async getModelPerformance(modelId, timeframe = '30d') {
    try {
      const cacheKey = `performance_${modelId}_${timeframe}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await this.mockAIServiceCall('models/performance', {
        modelId,
        timeframe
      });

      const performance = {
        modelId,
        accuracy: response.accuracy,
        precision: response.precision,
        recall: response.recall,
        f1Score: response.f1Score,
        sharpeRatio: response.sharpeRatio,
        winRate: response.winRate,
        totalSignals: response.totalSignals,
        profitableSignals: response.profitableSignals,
        timeframe,
        lastUpdated: new Date()
      };

      this.setCache(cacheKey, performance, 60 * 60 * 1000); // Cache for 1 hour
      return performance;
    } catch (error) {
      console.error('Model performance error:', error);
      throw new Error('Failed to get model performance');
    }
  }

  // Predict price movements
  async predictPrice(symbol, timeframes = ['1h', '4h', '1d']) {
    try {
      const predictions = {};
      
      for (const timeframe of timeframes) {
        const response = await this.mockAIServiceCall('models/predict', {
          symbol,
          timeframe,
          model: 'ensemble'
        });

        predictions[timeframe] = {
          currentPrice: response.currentPrice,
          predictedPrice: response.predictedPrice,
          confidence: response.confidence,
          direction: response.direction,
          volatility: response.volatility,
          factors: response.influencingFactors
        };
      }

      return {
        symbol,
        predictions,
        model: 'Ensemble-v1.0',
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Price prediction error:', error);
      throw new Error('Failed to predict price');
    }
  }

  // Combine multiple signals into a hybrid signal
  combineSignals(signals, symbol) {
    const weights = {
      lstm: 0.4,
      transformer: 0.35,
      sentiment: 0.25
    };

    let buyScore = 0;
    let sellScore = 0;
    let totalWeight = 0;
    let reasons = [];

    signals.forEach(signal => {
      const model = signal.model.toLowerCase();
      const weight = weights[model.includes('lstm') ? 'lstm' : 
                           model.includes('transformer') ? 'transformer' : 'sentiment'] || 0.2;
      
      if (signal.type === 'buy') {
        buyScore += signal.confidence * weight;
      } else if (signal.type === 'sell') {
        sellScore += signal.confidence * weight;
      }
      
      totalWeight += weight;
      reasons.push(`${signal.model}: ${signal.reason}`);
    });

    const netScore = (buyScore - sellScore) / totalWeight;
    const confidence = Math.abs(netScore);
    
    let type = 'hold';
    if (netScore > 0.2) type = 'buy';
    else if (netScore < -0.2) type = 'sell';

    return {
      id: `hybrid_${Date.now()}`,
      symbol,
      type,
      confidence: Math.min(confidence, 1.0),
      timeframe: '4h',
      reason: `Hybrid signal combining ${signals.length} models`,
      models: signals.map(s => s.model),
      detailedReasons: reasons,
      compositeScore: netScore,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
    };
  }

  // Mock AI service call (replace with actual HTTP calls to AI microservices)
  async mockAIServiceCall(endpoint, data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    // Mock responses based on endpoint
    switch (endpoint) {
      case 'lstm/signals':
        return {
          prediction: Math.random(),
          currentPrice: 35000,
          targetPrice: 35000 * (1 + (Math.random() - 0.5) * 0.1),
          stopLoss: 35000 * (1 - Math.random() * 0.05),
          technicalIndicators: {
            rsi: 50 + (Math.random() - 0.5) * 40,
            macd: Math.random() > 0.5 ? 'bullish' : 'bearish',
            volume: 'normal'
          }
        };
      
      case 'nlp/sentiment':
        return {
          overallSentiment: Math.random(),
          sourceSentiments: {
            twitter: Math.random(),
            reddit: Math.random(),
            news: Math.random()
          },
          trendingKeywords: ['bitcoin', 'ethereum', 'bull', 'market'],
          confidence: 0.7 + Math.random() * 0.3,
          mentionVolume: Math.floor(Math.random() * 10000) + 1000
        };
      
      case 'transformer/signals':
        return {
          prediction: Math.random(),
          currentPrice: 35000,
          targetPrice: 35000 * (1 + (Math.random() - 0.5) * 0.08),
          stopLoss: 35000 * (1 - Math.random() * 0.04),
          attentionWeights: [0.3, 0.2, 0.25, 0.15, 0.1]
        };
      
      default:
        return { success: true, data: {} };
    }
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.timeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout
    });
  }

  // Helper functions
  getTimeframeMs(timeframe) {
    const timeframes = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || timeframes['4h'];
  }
}

module.exports = AIService;
