'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';
import { Sparkles, Users, TrendingUp } from 'lucide-react';

import { FloatingElements } from '@/components/FloatingElements';
import { TipButton } from '@/components/TipButton';
import { CreatorProfileCard } from '@/components/CreatorProfileCard';
import { RecentTipsList } from '@/components/RecentTipsList';
import { GatedContentDisplay } from '@/components/GatedContentDisplay';
import { StatsChart } from '@/components/StatsChart';
import { generateMockData } from '@/lib/utils';
import { Tip } from '@/lib/types';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [tips, setTips] = useState<Tip[]>([]);
  const [isContentUnlocked, setIsContentUnlocked] = useState(false);
  
  const { mockCreator, mockTips, mockGatedContent } = generateMockData();

  useEffect(() => {
    setFrameReady();
    setTips(mockTips);
  }, [setFrameReady]);

  const handleTipSuccess = (newTip: Tip) => {
    setTips(prev => [newTip, ...prev]);
    
    // Check if tip unlocks gated content
    if (parseFloat(newTip.amount) >= parseFloat(mockGatedContent.minTipAmount)) {
      setIsContentUnlocked(true);
    }
  };

  const handleContentUnlock = () => {
    setIsContentUnlocked(true);
  };

  return (
    <div className="min-h-screen relative">
      <FloatingElements />
      
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-white border-opacity-10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TipJarz</h1>
              <p className="text-sm text-gray-400">Monetize your content</p>
            </div>
          </div>
          
          <Wallet>
            <ConnectWallet>
              <Name />
            </ConnectWallet>
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 pb-8">
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">TipJarz</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Get tips from your fans and monetize with 
              <br />
              tips today and fit in your social your frame.
            </p>
            <button className="btn-primary">
              Creator
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="metric-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Creators</div>
                  <div className="text-xl font-bold text-white">19,597</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">↗ Creators Earning</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Recent Tippers</div>
                  <div className="text-xl font-bold text-white">Live 🔴</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">↗ Active Tippers</div>
            </div>
          </div>

          {/* Creator Profile */}
          <CreatorProfileCard creator={mockCreator} />

          {/* Tip Button */}
          <div className="text-center">
            <TipButton
              creatorId={mockCreator.creatorId}
              onTipSuccess={handleTipSuccess}
              className="w-full max-w-sm mx-auto"
            />
          </div>

          {/* Gated Content */}
          <GatedContentDisplay
            content={mockGatedContent}
            isUnlocked={isContentUnlocked}
            onUnlock={handleContentUnlock}
          />

          {/* Stats Chart */}
          <StatsChart />

          {/* Recent Tips */}
          <RecentTipsList tips={tips} />

        </div>
      </main>
    </div>
  );
}
