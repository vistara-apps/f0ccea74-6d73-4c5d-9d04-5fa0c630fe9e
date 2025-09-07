'use client';

import { User, ExternalLink } from 'lucide-react';
import { CreatorProfileCardProps } from '@/lib/types';
import { formatAddress, formatAmount, cn } from '@/lib/utils';

export function CreatorProfileCard({ 
  creator, 
  totalTips = '19.597',
  tipCount = 156,
  className 
}: CreatorProfileCardProps) {
  return (
    <div className={cn('metric-card', className)}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
          {creator.avatar ? (
            <img 
              src={creator.avatar} 
              alt={creator.name || 'Creator'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={24} className="text-white" />
          )}
        </div>

        {/* Creator Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white truncate">
              {creator.name || 'Anonymous Creator'}
            </h3>
            <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
          </div>
          
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {creator.bio}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-400">
              Wallet: {formatAddress(creator.walletAddress)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-gradient">
              {formatAmount(totalTips)}
            </div>
            <div className="text-sm text-gray-400">Total Tips</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">
              {tipCount}
            </div>
            <div className="text-sm text-gray-400">Supporters</div>
          </div>
        </div>
      </div>
    </div>
  );
}
