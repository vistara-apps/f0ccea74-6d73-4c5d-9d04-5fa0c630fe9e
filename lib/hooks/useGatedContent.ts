import { useState, useEffect, useCallback } from 'react';
import { walletService } from '@/lib/wallet';
import { GatedContent } from '@/lib/types';

interface UseGatedContentOptions {
  creatorId: string;
}

interface GatedContentState {
  content: GatedContent[];
  loading: boolean;
  error: string | null;
}

interface UnlockResult {
  success: boolean;
  error?: string;
  content?: {
    content_id: string;
    title: string;
    description: string;
    secret_content: string;
    unlocked_at: string;
  };
  required?: string;
  current?: string;
  remaining?: string;
}

export function useGatedContent({ creatorId }: UseGatedContentOptions) {
  const [state, setState] = useState<GatedContentState>({
    content: [],
    loading: true,
    error: null
  });

  const [unlocking, setUnlocking] = useState<Record<string, boolean>>({});

  // Fetch gated content from API
  const fetchContent = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/gated-content?creatorId=${creatorId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch gated content');
      }

      // Convert database format to frontend format
      const content: GatedContent[] = data.content.map((item: any) => ({
        contentId: item.content_id,
        creatorId: item.creator_id,
        secretContent: '', // Not included in list view
        minTipAmount: item.min_tip_amount,
        unlockLimit: item.unlock_limit,
        title: item.title,
        description: item.description
      }));

      setState({
        content,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching gated content:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch content'
      }));
    }
  }, [creatorId]);

  // Unlock content
  const unlockContent = useCallback(async (contentId: string): Promise<UnlockResult> => {
    try {
      setUnlocking(prev => ({ ...prev, [contentId]: true }));

      // Get current user address
      const tipperAddress = await walletService.getCurrentAddress();
      if (!tipperAddress) {
        throw new Error('Wallet not connected');
      }

      const response = await fetch('/api/gated-content/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          tipperAddress
        })
      });

      const data = await response.json();

      if (!data.success) {
        return {
          success: false,
          error: data.error,
          required: data.required,
          current: data.current,
          remaining: data.remaining
        };
      }

      return {
        success: true,
        content: data.content
      };

    } catch (error) {
      console.error('Error unlocking content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unlock content'
      };
    } finally {
      setUnlocking(prev => ({ ...prev, [contentId]: false }));
    }
  }, []);

  // Create new gated content
  const createContent = useCallback(async (params: {
    title: string;
    description: string;
    secretContent: string;
    minTipAmount: string;
    unlockLimit?: number;
  }): Promise<{ success: boolean; error?: string; content?: GatedContent }> => {
    try {
      const response = await fetch('/api/gated-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId,
          ...params
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create content');
      }

      // Convert to frontend format
      const newContent: GatedContent = {
        contentId: data.content.content_id,
        creatorId: data.content.creator_id,
        secretContent: data.content.secret_content,
        minTipAmount: data.content.min_tip_amount,
        unlockLimit: data.content.unlock_limit,
        title: data.content.title,
        description: data.content.description
      };

      // Update local state
      setState(prev => ({
        ...prev,
        content: [newContent, ...prev.content]
      }));

      return { success: true, content: newContent };

    } catch (error) {
      console.error('Error creating gated content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create content'
      };
    }
  }, [creatorId]);

  // Check if user can unlock content
  const canUnlock = useCallback(async (contentId: string): Promise<{
    canUnlock: boolean;
    required: string;
    current: string;
    remaining: string;
  }> => {
    try {
      const tipperAddress = await walletService.getCurrentAddress();
      if (!tipperAddress) {
        return {
          canUnlock: false,
          required: '0',
          current: '0',
          remaining: '0'
        };
      }

      const result = await unlockContent(contentId);
      
      if (result.success) {
        return {
          canUnlock: true,
          required: '0',
          current: '0',
          remaining: '0'
        };
      }

      return {
        canUnlock: false,
        required: result.required || '0',
        current: result.current || '0',
        remaining: result.remaining || '0'
      };

    } catch (error) {
      console.error('Error checking unlock status:', error);
      return {
        canUnlock: false,
        required: '0',
        current: '0',
        remaining: '0'
      };
    }
  }, [unlockContent]);

  // Refresh content
  const refresh = useCallback(() => {
    fetchContent();
  }, [fetchContent]);

  // Initial fetch
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    ...state,
    unlockContent,
    createContent,
    canUnlock,
    unlocking,
    refresh,
    refetch: fetchContent
  };
}
