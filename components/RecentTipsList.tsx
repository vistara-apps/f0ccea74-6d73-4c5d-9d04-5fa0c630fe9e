'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { RecentTipsListProps } from '@/lib/types';
import { formatAddress, formatAmount, formatTimeAgo, cn } from '@/lib/utils';

export function RecentTipsList({ 
  tips, 
  showAmount = true, 
  maxItems = 5,
  className 
}: RecentTipsListProps) {
  const displayTips = tips.slice(0, maxItems);

  if (displayTips.length === 0) {
    return (
      <div className={cn('metric-card text-center py-8', className)}>
        <Heart size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-400">No tips yet</p>
        <p className="text-sm text-gray-500 mt-1">Be the first to show support!</p>
      </div>
    );
  }

  return (
    <div className={cn('metric-card', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Heart size={20} className="text-pink-400" />
        <h3 className="text-lg font-semibold text-white">Recent Tippers</h3>
      </div>

      <div className="space-y-3">
        {displayTips.map((tip) => (
          <div 
            key={tip.tipId}
            className="flex items-start gap-3 p-3 rounded-md bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-200"
          >
            {/* Tipper Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {tip.tipperAddress.slice(2, 4).toUpperCase()}
              </span>
            </div>

            {/* Tip Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {formatAddress(tip.tipperAddress)}
                </span>
                {showAmount && (
                  <span className="text-sm font-bold text-gradient">
                    {formatAmount(tip.amount, tip.currency)}
                  </span>
                )}
              </div>
              
              {tip.message && (
                <div className="flex items-start gap-2 mt-2">
                  <MessageCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {tip.message}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-1">
                {formatTimeAgo(tip.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tips.length > maxItems && (
        <div className="mt-4 pt-3 border-t border-white border-opacity-20">
          <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
            View all {tips.length} tips →
          </button>
        </div>
      )}
    </div>
  );
}
