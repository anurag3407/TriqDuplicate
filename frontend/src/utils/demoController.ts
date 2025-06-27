import { gsap } from 'gsap';
import { useMarketStore, usePortfolioStore } from '../stores';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  action: () => Promise<void>;
}

class DemoController {
  private steps: DemoStep[] = [];
  private currentStep = 0;
  private isRunning = false;
  private timeline: gsap.core.Timeline | null = null;

  constructor() {
    this.initializeDemoSteps();
  }

  private initializeDemoSteps() {
    this.steps = [
      {
        id: 'welcome',
        title: 'Welcome to AI Trading Platform',
        description: 'Experience the future of algorithmic trading',
        duration: 3000,
        action: async () => {
          await this.animateWelcome();
        }
      },
      {
        id: 'globe-interaction',
        title: '3D Market Visualization',
        description: 'Interactive global market data in real-time',
        duration: 5000,
        action: async () => {
          await this.animateGlobeFeatures();
        }
      },
      {
        id: 'ai-signals',
        title: 'AI Trading Signals',
        description: 'Machine learning powered trading recommendations',
        duration: 4000,
        action: async () => {
          await this.demonstrateAISignals();
        }
      },
      {
        id: 'portfolio-showcase',
        title: 'Portfolio Analytics',
        description: 'Comprehensive portfolio performance tracking',
        duration: 6000,
        action: async () => {
          await this.showcasePortfolio();
        }
      },
      {
        id: 'trading-demo',
        title: 'Advanced Trading Interface',
        description: 'Professional-grade order management',
        duration: 5000,
        action: async () => {
          await this.demonstrateTrading();
        }
      },
      {
        id: 'analytics-deep-dive',
        title: 'Risk Analytics',
        description: 'Advanced risk metrics and performance analysis',
        duration: 4000,
        action: async () => {
          await this.showcaseAnalytics();
        }
      },
      {
        id: 'orderbook-live',
        title: 'Live Order Book',
        description: 'Real-time market depth visualization',
        duration: 3000,
        action: async () => {
          await this.demonstrateOrderBook();
        }
      }
    ];
  }

  async startDemo(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.currentStep = 0;

    // Show demo overlay
    this.showDemoOverlay();

    try {
      for (let i = 0; i < this.steps.length; i++) {
        this.currentStep = i;
        const step = this.steps[i];
        
        // Update demo overlay
        this.updateDemoOverlay(step);
        
        // Execute step action
        await step.action();
        
        // Wait for step duration
        await this.wait(step.duration);
      }
    } catch (error) {
      console.error('Demo error:', error);
    } finally {
      this.stopDemo();
    }
  }

  stopDemo(): void {
    this.isRunning = false;
    this.currentStep = 0;
    
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    
    this.hideDemoOverlay();
  }

  private async animateWelcome(): Promise<void> {
    const tl = gsap.timeline();
    
    // Fade in hero elements
    tl.from('.glass-card', { 
      opacity: 0, 
      y: 50, 
      duration: 1, 
      stagger: 0.2 
    })
    .from('.ai-signal-card', { 
      opacity: 0, 
      scale: 0.8, 
      duration: 0.8, 
      stagger: 0.1 
    }, '-=0.5');

    return new Promise(resolve => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  private async animateGlobeFeatures(): Promise<void> {
    const globeContainer = document.querySelector('[data-testid="market-globe"]');
    if (!globeContainer) return;

    const tl = gsap.timeline();
    
    // Highlight globe container
    tl.to(globeContainer, { 
      scale: 1.05, 
      duration: 1, 
      ease: 'power2.inOut' 
    })
    .to(globeContainer, { 
      scale: 1, 
      duration: 1, 
      ease: 'power2.inOut' 
    });

    // Simulate interactive features
    await this.simulateGlobeInteractions();

    return new Promise(resolve => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  private async demonstrateAISignals(): Promise<void> {
    const { addAISignal } = useMarketStore.getState();
    
    // Generate demo AI signals
    const demoSignals = [
      {
        id: 'demo-1',
        symbol: 'BTC',
        type: 'BUY' as const,
        confidence: 89,
        price: 52398,
        reasoning: 'Strong bullish momentum detected',
        timestamp: Date.now(),
        timeframe: '1h',
        indicators: ['RSI', 'MACD', 'Volume'],
        targetPrice: 55000,
        stopLoss: 51000
      },
      {
        id: 'demo-2',
        symbol: 'ETH',
        type: 'SELL' as const,
        confidence: 76,
        price: 2298,
        reasoning: 'Resistance level approaching',
        timestamp: Date.now() + 1000,
        timeframe: '4h',
        indicators: ['MA', 'Fibonacci', 'Support'],
        targetPrice: 2200,
        stopLoss: 2350
      }
    ];

    for (const signal of demoSignals) {
      addAISignal(signal);
      await this.wait(1000);
      
      // Animate signal cards
      const signalCards = document.querySelectorAll('.ai-signal-card');
      gsap.from(signalCards[signalCards.length - 1], {
        opacity: 0,
        x: 100,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }

  private async showcasePortfolio(): Promise<void> {
    const { toggleBalanceVisibility } = usePortfolioStore.getState();
    
    // Animate portfolio cards
    const portfolioCards = document.querySelectorAll('[data-component="portfolio"] .portfolio-card');
    
    const tl = gsap.timeline();
    tl.from(portfolioCards, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2
    });

    // Toggle balance visibility for demo
    await this.wait(2000);
    toggleBalanceVisibility();
    await this.wait(1500);
    toggleBalanceVisibility();

    return new Promise(resolve => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  private async demonstrateTrading(): Promise<void> {
    // Simulate order placement
    const orderForm = document.querySelector('[data-component="trading-form"]');
    if (!orderForm) return;

    const tl = gsap.timeline();
    
    // Highlight order form
    tl.to(orderForm, {
      boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
      duration: 0.5
    })
    .to(orderForm, {
      boxShadow: 'none',
      duration: 0.5
    });

    // Simulate form interactions
    await this.simulateFormInteractions();

    return new Promise(resolve => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  private async showcaseAnalytics(): Promise<void> {
    const analyticsCharts = document.querySelectorAll('[data-component="analytics"] .chart-container');
    
    const tl = gsap.timeline();
    
    // Animate charts
    tl.from(analyticsCharts, {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      stagger: 0.3,
      ease: 'power2.out'
    });

    return new Promise(resolve => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  private async demonstrateOrderBook(): Promise<void> {
    const orderBookRows = document.querySelectorAll('[data-component="order-book"] .order-row');
    
    // Highlight order book updates
    const tl = gsap.timeline();
    
    orderBookRows.forEach((row, index) => {
      tl.to(row, {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        duration: 0.3,
        delay: index * 0.05
      })
      .to(row, {
        backgroundColor: 'transparent',
        duration: 0.3
      });
    });

    return new Promise(resolve => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  private async simulateGlobeInteractions(): Promise<void> {
    // Simulate clicking on different market nodes
    const markets = ['US', 'EU', 'ASIA', 'CRYPTO'];
    
    for (const market of markets) {
      // Dispatch custom event for globe interaction
      window.dispatchEvent(new CustomEvent('demo:globe-highlight', { 
        detail: { market } 
      }));
      await this.wait(800);
    }
  }

  private async simulateFormInteractions(): Promise<void> {
    // Simulate typing in form fields
    const events = [
      { type: 'form-focus', field: 'quantity' },
      { type: 'form-type', field: 'quantity', value: '0.5' },
      { type: 'form-focus', field: 'price' },
      { type: 'form-type', field: 'price', value: '52500' },
      { type: 'form-submit' }
    ];

    for (const event of events) {
      window.dispatchEvent(new CustomEvent('demo:form-interaction', { 
        detail: event 
      }));
      await this.wait(500);
    }
  }

  private showDemoOverlay(): void {
    const overlay = document.createElement('div');
    overlay.id = 'demo-overlay';
    overlay.className = `
      fixed top-4 right-4 z-50 bg-dark-800/90 backdrop-blur-xl 
      border border-primary-500/50 rounded-2xl p-6 max-w-sm
      shadow-2xl shadow-primary-500/20
    `;
    
    overlay.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white">Demo Mode</h3>
        <button id="demo-stop" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div id="demo-content">
        <h4 id="demo-title" class="font-semibold text-primary-400 mb-2"></h4>
        <p id="demo-description" class="text-sm text-gray-300 mb-4"></p>
        <div id="demo-progress" class="w-full bg-dark-600 rounded-full h-2">
          <div id="demo-progress-bar" class="bg-primary-500 h-2 rounded-full transition-all duration-300"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add stop button listener
    document.getElementById('demo-stop')?.addEventListener('click', () => {
      this.stopDemo();
    });

    // Animate in
    gsap.from(overlay, {
      opacity: 0,
      x: 100,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  }

  private updateDemoOverlay(step: DemoStep): void {
    const titleEl = document.getElementById('demo-title');
    const descriptionEl = document.getElementById('demo-description');
    const progressBar = document.getElementById('demo-progress-bar');

    if (titleEl) titleEl.textContent = step.title;
    if (descriptionEl) descriptionEl.textContent = step.description;
    
    if (progressBar) {
      const progress = ((this.currentStep + 1) / this.steps.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  private hideDemoOverlay(): void {
    const overlay = document.getElementById('demo-overlay');
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        x: 100,
        duration: 0.3,
        onComplete: () => overlay.remove()
      });
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for external control
  isActive(): boolean {
    return this.isRunning;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  getTotalSteps(): number {
    return this.steps.length;
  }
}

// Export singleton instance
export const demoController = new DemoController();

// Global demo functions
export const startDemo = () => demoController.startDemo();
export const stopDemo = () => demoController.stopDemo();
export const isDemoActive = () => demoController.isActive();
