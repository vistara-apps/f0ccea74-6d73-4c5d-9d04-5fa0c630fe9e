'use client';

import { useState } from 'react';
import { Heart, Loader2, AlertCircle } from 'lucide-react';
import { TipButtonProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTips } from '@/lib/hooks/useTips';

export function TipButton({ 
  variant = 'default', 
  creatorId, 
  amount = '0.01',
  onTipSuccess,
  disabled = false,
  className 
}: TipButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { sendTip, sendingTip } = useTips({ 
    creatorId,
    autoRefresh: false 
  });

  const handleTip = async () => {
    if (disabled || sendingTip) return;
    
    setError(null);
    
    try {
      // For demo purposes, we'll use a mock creator address
      // In a real app, this would come from the creator's profile
      const creatorAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      
      const result = await sendTip({
        amount,
        creatorAddress,
        message: 'Thanks for the great content!'
      });
      
      if (result.success && result.tip) {
        setShowSuccess(true);
        onTipSuccess?.(result.tip);
        
        // Reset success state after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to send tip');
        setTimeout(() => setError(null), 5000);
      }
      
    } catch (error) {
      console.error('Tip failed:', error);
      setError('Failed to send tip');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={handleTip}
          disabled={disabled || sendingTip}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            showSuccess 
              ? 'bg-green-500 text-white' 
              : error
              ? 'bg-red-500 text-white'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          {sendingTip ? (
            <Loader2 size={16} className="animate-spin" />
          ) : showSuccess ? (
            '✓'
          ) : error ? (
            <AlertCircle size={16} />
          ) : (
            <Heart size={16} />
          )}
          {showSuccess ? 'Tipped!' : error ? 'Failed' : `Tip ${amount} ETH`}
        </button>
        {error && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-red-500 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleTip}
        disabled={disabled || sendingTip}
        className={cn(
          'btn-primary flex items-center gap-3 text-lg relative overflow-hidden',
          showSuccess && 'bg-green-500 hover:bg-green-600',
          error && 'bg-red-500 hover:bg-red-600',
          disabled && 'opacity-50 cursor-not-allowed',
          sendingTip && 'animate-pulse',
          className
        )}
      >
        {sendingTip ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : showSuccess ? (
          <>
            <span className="text-2xl">✓</span>
            Tip Sent!
          </>
        ) : error ? (
          <>
            <AlertCircle size={20} />
            Try Again
          </>
        ) : (
          <>
            <Heart size={20} className="fill-current" />
            Tip {amount} ETH
          </>
        )}
      </button>
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-red-500 text-white text-sm rounded shadow-lg z-10 max-w-xs text-center">
          {error}
        </div>
      )}
    </div>
  );
}
