import { useState, useEffect, useCallback } from 'react';
import { walletService } from '@/lib/wallet';
import { Tip } from '@/lib/types';

interface UseTipsOptions {
  creatorId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface TipState {
  tips: Tip[];
  loading: boolean;
  error: string | null;
  totalAmount: string;
  totalCount: number;
}

interface SendTipParams {
  amount: string;
  message?: string;
  creatorAddress: string;
}

export function useTips({ creatorId, autoRefresh = false, refreshInterval = 30000 }: UseTipsOptions) {
  const [state, setState] = useState<TipState>({
    tips: [],
    loading: true,
    error: null,
    totalAmount: '0',
    totalCount: 0
  });

  const [sendingTip, setSendingTip] = useState(false);

  // Fetch tips from API
  const fetchTips = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/tips?creatorId=${creatorId}&limit=20`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch tips');
      }

      // Convert database format to frontend format
      const tips: Tip[] = data.tips.map((tip: any) => ({
        tipId: tip.tip_id,
        creatorId: tip.creator_id,
        tipperAddress: tip.tipper_address,
        amount: tip.amount,
        currency: tip.currency,
        timestamp: new Date(tip.timestamp),
        message: tip.message,
        unlockedContentId: tip.unlocked_content_id
      }));

      // Calculate totals
      const totalAmount = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0);
      const totalCount = tips.length;

      setState({
        tips,
        loading: false,
        error: null,
        totalAmount: totalAmount.toString(),
        totalCount
      });

    } catch (error) {
      console.error('Error fetching tips:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tips'
      }));
    }
  }, [creatorId]);

  // Send a tip
  const sendTip = useCallback(async (params: SendTipParams): Promise<{ success: boolean; error?: string; tip?: Tip }> => {
    try {
      setSendingTip(true);

      // Get current user address
      const tipperAddress = await walletService.getCurrentAddress();
      if (!tipperAddress) {
        throw new Error('Wallet not connected');
      }

      // Send blockchain transaction
      const txResult = await walletService.sendTip({
        creatorAddress: params.creatorAddress,
        amount: params.amount,
        message: params.message
      });

      if (!txResult.success) {
        throw new Error(txResult.error || 'Transaction failed');
      }

      // Create tip record in database
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId,
          tipperAddress,
          amount: params.amount,
          currency: 'ETH',
          message: params.message,
          transactionHash: txResult.hash
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to record tip');
      }

      // Convert to frontend format
      const newTip: Tip = {
        tipId: data.tip.tip_id,
        creatorId: data.tip.creator_id,
        tipperAddress: data.tip.tipper_address,
        amount: data.tip.amount,
        currency: data.tip.currency,
        timestamp: new Date(data.tip.timestamp),
        message: data.tip.message,
        unlockedContentId: data.tip.unlocked_content_id
      };

      // Update local state
      setState(prev => ({
        ...prev,
        tips: [newTip, ...prev.tips],
        totalAmount: (parseFloat(prev.totalAmount) + parseFloat(newTip.amount)).toString(),
        totalCount: prev.totalCount + 1
      }));

      // Update tip status to confirmed (in real app, this would be done by a webhook)
      setTimeout(async () => {
        try {
          await fetch('/api/tips', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tipId: newTip.tipId,
              status: 'confirmed',
              transactionHash: txResult.hash
            })
          });
        } catch (error) {
          console.error('Failed to update tip status:', error);
        }
      }, 3000);

      return { success: true, tip: newTip };

    } catch (error) {
      console.error('Error sending tip:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send tip'
      };
    } finally {
      setSendingTip(false);
    }
  }, [creatorId]);

  // Refresh tips
  const refresh = useCallback(() => {
    fetchTips();
  }, [fetchTips]);

  // Initial fetch
  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchTips, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTips]);

  return {
    ...state,
    sendTip,
    sendingTip,
    refresh,
    refetch: fetchTips
  };
}
