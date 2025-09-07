export interface Creator {
  creatorId: string; // farcaster_user_id
  walletAddress: string;
  bio: string;
  content: string;
  name?: string;
  avatar?: string;
}

export interface Tip {
  tipId: string;
  creatorId: string;
  tipperAddress: string;
  amount: string;
  currency: string;
  timestamp: Date;
  message?: string;
  unlockedContentId?: string;
}

export interface GatedContent {
  contentId: string;
  creatorId: string;
  secretContent: string;
  minTipAmount: string;
  unlockLimit?: number;
  title: string;
  description: string;
}

export interface TipButtonProps {
  variant?: 'default' | 'compact';
  creatorId: string;
  amount?: string;
  onTipSuccess?: (tip: Tip) => void;
  disabled?: boolean;
  className?: string;
}

export interface CreatorProfileCardProps {
  creator: Creator;
  totalTips?: string;
  tipCount?: number;
  className?: string;
}

export interface RecentTipsListProps {
  tips: Tip[];
  showAmount?: boolean;
  maxItems?: number;
  className?: string;
}

export interface GatedContentDisplayProps {
  content: GatedContent;
  isUnlocked: boolean;
  onUnlock?: () => void;
  variant?: 'locked' | 'unlocked';
  className?: string;
}
