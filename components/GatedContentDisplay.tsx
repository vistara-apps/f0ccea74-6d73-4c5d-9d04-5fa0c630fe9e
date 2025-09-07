'use client';

import { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { GatedContentDisplayProps } from '@/lib/types';
import { formatAmount, cn } from '@/lib/utils';
import { TipButton } from './TipButton';

export function GatedContentDisplay({ 
  content, 
  isUnlocked, 
  onUnlock,
  variant = 'locked',
  className 
}: GatedContentDisplayProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleUnlock = () => {
    onUnlock?.();
  };

  if (isUnlocked || variant === 'unlocked') {
    return (
      <div className={cn('metric-card border-green-400 border-opacity-50', className)}>
        <div className="flex items-center gap-2 mb-4">
          <Unlock size={20} className="text-green-400" />
          <h3 className="text-lg font-semibold text-white">
            {content.title}
          </h3>
        </div>

        <div className="bg-green-500 bg-opacity-10 border border-green-400 border-opacity-30 rounded-md p-4">
          <p className="text-green-100 leading-relaxed">
            {content.secretContent}
          </p>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          ✓ Unlocked with {formatAmount(content.minTipAmount)} tip
        </div>
      </div>
    );
  }

  return (
    <div className={cn('metric-card border-purple-400 border-opacity-50', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Lock size={20} className="text-purple-400" />
        <h3 className="text-lg font-semibold text-white">
          {content.title}
        </h3>
      </div>

      <p className="text-gray-300 mb-4">
        {content.description}
      </p>

      {/* Preview Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>

        {showPreview && (
          <div className="mt-3 p-3 bg-white bg-opacity-5 rounded-md border border-white border-opacity-10">
            <p className="text-gray-400 text-sm">
              {content.secretContent.slice(0, 100)}...
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Preview • Full content available after tipping
            </div>
          </div>
        )}
      </div>

      {/* Unlock Requirements */}
      <div className="bg-purple-500 bg-opacity-10 border border-purple-400 border-opacity-30 rounded-md p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-purple-200">Minimum tip to unlock:</span>
          <span className="font-bold text-purple-100">
            {formatAmount(content.minTipAmount)} ETH
          </span>
        </div>
        
        {content.unlockLimit && (
          <div className="text-xs text-purple-300">
            Limited to {content.unlockLimit} unlocks
          </div>
        )}
      </div>

      {/* Unlock Button */}
      <TipButton
        creatorId={content.creatorId}
        amount={content.minTipAmount}
        onTipSuccess={handleUnlock}
        className="w-full"
      />
    </div>
  );
}
