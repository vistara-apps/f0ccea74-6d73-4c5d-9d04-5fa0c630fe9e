'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { TipButtonProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function TipButton({ 
  variant = 'default', 
  creatorId, 
  amount = '0.01',
  onTipSuccess,
  disabled = false,
  className 
}: TipButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTip = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful tip
      const mockTip = {
        tipId: `tip_${Date.now()}`,
        creatorId,
        tipperAddress: '0x1234...5678',
        amount,
        currency: 'ETH',
        timestamp: new Date(),
        message: 'Thanks for the great content!'
      };
      
      setShowSuccess(true);
      onTipSuccess?.(mockTip);
      
      // Reset success state after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleTip}
        disabled={disabled || isLoading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
          showSuccess 
            ? 'bg-green-500 text-white' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : showSuccess ? (
          '✓'
        ) : (
          <Heart size={16} />
        )}
        {showSuccess ? 'Tipped!' : `Tip ${amount} ETH`}
      </button>
    );
  }

  return (
    <button
      onClick={handleTip}
      disabled={disabled || isLoading}
      className={cn(
        'btn-primary flex items-center gap-3 text-lg relative overflow-hidden',
        showSuccess && 'bg-green-500 hover:bg-green-600',
        disabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'animate-pulse-glow',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Processing...
        </>
      ) : showSuccess ? (
        <>
          <span className="text-2xl">✓</span>
          Tip Sent!
        </>
      ) : (
        <>
          <Heart size={20} className="fill-current" />
          Tip {amount} ETH
        </>
      )}
    </button>
  );
}
