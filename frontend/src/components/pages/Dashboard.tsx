import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Preload } from '@react-three/drei';
import { MarketGlobe } from '../three/MarketGlobe';
import { AISignalCards } from '../widgets/AISignalCards';
import { useUIStore } from '../../stores';

export function Dashboard() {
  const { setActiveTab } = useUIStore();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">TRIQ AI</span>
        </h1>
        <p className="text-xl text-secondary-300 max-w-2xl mx-auto">
          Advanced AI-powered trading platform with real-time market insights and automated trading strategies.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">+24.5%</div>
          <div className="text-secondary-400">Portfolio Growth</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-primary-400 mb-2">87</div>
          <div className="text-secondary-400">Active Signals</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">99.2%</div>
          <div className="text-secondary-400">AI Accuracy</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 3D Market Globe */}
        <div className="glass-card h-96">
          <div className="p-6 border-b border-secondary-700">
            <h2 className="text-xl font-semibold text-white">Global Market View</h2>
            <p className="text-sm text-secondary-400">Interactive 3D market visualization</p>
          </div>
          <div className="h-80 relative">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-secondary-400">Loading 3D visualization...</p>
                </div>
              </div>
            }>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                className="!absolute !inset-0"
              >
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <MarketGlobe />
                <OrbitControls 
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                />
                <Environment preset="night" />
                <Preload all />
              </Canvas>
            </Suspense>
          </div>
        </div>

        {/* AI Signals */}
        <div className="glass-card">
          <div className="p-6 border-b border-secondary-700">
            <h2 className="text-xl font-semibold text-white">AI Trading Signals</h2>
            <p className="text-sm text-secondary-400">Latest recommendations from our AI engine</p>
          </div>
          <div className="p-6">
            <AISignalCards />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setActiveTab('portfolio')}
          className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">View Portfolio</h3>
          <p className="text-secondary-400 text-sm">Manage your investments and track performance</p>
        </div>

        <div 
          onClick={() => setActiveTab('trading')}
          className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Start Trading</h3>
          <p className="text-secondary-400 text-sm">Execute trades with AI-powered insights</p>
        </div>

        <div 
          onClick={() => setActiveTab('analytics')}
          className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">View Analytics</h3>
          <p className="text-secondary-400 text-sm">Deep dive into market trends and data</p>
        </div>
      </div>
    </div>
  );
}
