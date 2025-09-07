'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { GatedContentDisplayProps } from '@/lib/types';
import { formatAmount, cn } from '@/lib/utils';
import { TipButton } from './TipButton';
import { useGatedContent } from '@/lib/hooks/useGatedContent';

export function GatedContentDisplay({ 
  content, 
  isUnlocked: initialUnlocked = false, 
  onUnlock,
  variant = 'locked',
  className 
}: GatedContentDisplayProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked);
  const [unlockedContent, setUnlockedContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [unlockProgress, setUnlockProgress] = useState<{
    required: string;
    current: string;
    remaining: string;
  } | null>(null);
  
  const { unlockContent, unlocking } = useGatedContent({
    creatorId: content.creatorId
  });

  const isCurrentlyUnlocking = unlocking[content.contentId] || false;

  useEffect(() => {
    setIsUnlocked(initialUnlocked);
  }, [initialUnlocked]);

  const handleTipSuccess = async () => {
    // After a successful tip, try to unlock the content
    setError(null);
    
    try {
      const result = await unlockContent(content.contentId);
      
      if (result.success && result.content) {
        setIsUnlocked(true);
        setUnlockedContent(result.content.secret_content);
        onUnlock?.();
      } else {
        // Show progress if user hasn't tipped enough yet
        if (result.required && result.current && result.remaining) {
          setUnlockProgress({
            required: result.required,
            current: result.current,
            remaining: result.remaining
          });
        }
        setError(result.error || 'Content not yet unlocked');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error checking unlock status:', error);
      setError('Failed to check unlock status');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleManualUnlock = async () => {
    if (isUnlocked || isCurrentlyUnlocking) return;
    
    setError(null);
    
    try {
      const result = await unlockContent(content.contentId);
      
      if (result.success && result.content) {
        setIsUnlocked(true);
        setUnlockedContent(result.content.secret_content);
        onUnlock?.();
      } else {
        if (result.required && result.current && result.remaining) {
          setUnlockProgress({
            required: result.required,
            current: result.current,
            remaining: result.remaining
          });
        }
        setError(result.error || 'Insufficient tips to unlock');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error unlocking content:', error);
      setError('Failed to unlock content');
      setTimeout(() => setError(null), 5000);
    }
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
            {unlockedContent || content.secretContent}
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
        
        {unlockProgress && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-purple-300">Your tips:</span>
              <span className="text-purple-200">{formatAmount(unlockProgress.current)} ETH</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-purple-300">Remaining:</span>
              <span className="text-purple-200">{formatAmount(unlockProgress.remaining)} ETH</span>
            </div>
            <div className="w-full bg-purple-900 bg-opacity-50 rounded-full h-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (parseFloat(unlockProgress.current) / parseFloat(unlockProgress.required)) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
        
        {content.unlockLimit && (
          <div className="text-xs text-purple-300 mt-2">
            Limited to {content.unlockLimit} unlocks
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-400 border-opacity-30 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <TipButton
          creatorId={content.creatorId}
          amount={content.minTipAmount}
          onTipSuccess={handleTipSuccess}
          className="w-full"
        />
        
        <button
          onClick={handleManualUnlock}
          disabled={isCurrentlyUnlocking}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 rounded-lg text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCurrentlyUnlocking ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Unlock size={16} />
              Try to Unlock
            </>
          )}
        </button>
      </div>
    </div>
  );
}
