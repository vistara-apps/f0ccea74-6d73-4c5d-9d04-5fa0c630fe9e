import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: string, currency: string = 'ETH'): string {
  const num = parseFloat(amount);
  if (num === 0) return '0';
  if (num < 0.001) return `<0.001 ${currency}`;
  if (num < 1) return `${num.toFixed(3)} ${currency}`;
  return `${num.toFixed(2)} ${currency}`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function generateMockData() {
  const mockCreator: Creator = {
    creatorId: 'creator_1',
    walletAddress: '0x1234567890123456789012345678901234567890',
    bio: 'Content creator passionate about Web3 and decentralized communities. Building the future of creator economy.',
    content: 'Latest post about Base ecosystem developments',
    name: 'Alex Creator',
    avatar: '/api/placeholder/64/64'
  };

  const mockTips: Tip[] = [
    {
      tipId: 'tip_1',
      creatorId: 'creator_1',
      tipperAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      amount: '0.05',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      message: 'Great content! Keep it up! 🚀'
    },
    {
      tipId: 'tip_2',
      creatorId: 'creator_1',
      tipperAddress: '0x9876543210987654321098765432109876543210',
      amount: '0.02',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      message: 'Love your insights on Base!'
    },
    {
      tipId: 'tip_3',
      creatorId: 'creator_1',
      tipperAddress: '0xfedcba0987654321fedcba0987654321fedcba09',
      amount: '0.1',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    }
  ];

  const mockGatedContent: GatedContent = {
    contentId: 'content_1',
    creatorId: 'creator_1',
    secretContent: 'Exclusive: My complete guide to building on Base, including advanced tips and strategies that I\'ve learned over the past year. This includes code examples, best practices, and insider knowledge about the ecosystem.',
    minTipAmount: '0.01',
    title: 'Exclusive Base Building Guide',
    description: 'Unlock my complete guide to building on Base with advanced tips and strategies.'
  };

  return { mockCreator, mockTips, mockGatedContent };
}
