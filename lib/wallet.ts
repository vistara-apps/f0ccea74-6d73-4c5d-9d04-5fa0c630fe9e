import { parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

export interface TransactionParams {
  to: string;
  value: string; // in ETH
  data?: string;
}

export interface TipTransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

export class WalletService {
  private static instance: WalletService;

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Send a tip transaction using OnchainKit
   */
  async sendTip(params: {
    creatorAddress: string;
    amount: string; // in ETH
    message?: string;
  }): Promise<TipTransactionResult> {
    try {
      // This would integrate with OnchainKit's transaction methods
      // For now, we'll simulate the transaction
      
      const { creatorAddress, amount } = params;
      
      // Validate inputs
      if (!this.isValidAddress(creatorAddress)) {
        throw new Error('Invalid creator address');
      }

      if (!this.isValidAmount(amount)) {
        throw new Error('Invalid tip amount');
      }

      // In a real implementation, this would use OnchainKit's transaction methods
      // For demo purposes, we'll simulate a transaction
      const simulatedHash = this.generateTransactionHash();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (!success) {
        throw new Error('Transaction failed');
      }

      return {
        hash: simulatedHash,
        success: true
      };

    } catch (error) {
      console.error('Tip transaction failed:', error);
      return {
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get the current user's wallet address
   */
  async getCurrentAddress(): Promise<string | null> {
    try {
      // This would integrate with OnchainKit's wallet connection
      // For demo purposes, return a mock address
      return '0x1234567890123456789012345678901234567890';
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      return null;
    }
  }

  /**
   * Check if wallet is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      const address = await this.getCurrentAddress();
      return !!address;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address?: string): Promise<string> {
    try {
      // This would integrate with OnchainKit's balance methods
      // For demo purposes, return a mock balance
      return '1.5'; // ETH
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  /**
   * Validate Ethereum address
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate tip amount
   */
  private isValidAmount(amount: string): boolean {
    try {
      const num = parseFloat(amount);
      return !isNaN(num) && num > 0 && num <= 10; // Max 10 ETH tip
    } catch {
      return false;
    }
  }

  /**
   * Generate a mock transaction hash
   */
  private generateTransactionHash(): string {
    return '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: string, currency = 'ETH'): string {
    try {
      const num = parseFloat(amount);
      if (num === 0) return '0';
      if (num < 0.001) return `<0.001 ${currency}`;
      if (num < 1) return `${num.toFixed(3)} ${currency}`;
      return `${num.toFixed(2)} ${currency}`;
    } catch {
      return `0 ${currency}`;
    }
  }

  /**
   * Convert ETH to Wei
   */
  toWei(amount: string): bigint {
    return parseEther(amount);
  }

  /**
   * Convert Wei to ETH
   */
  fromWei(amount: bigint): string {
    return formatEther(amount);
  }
}

// Export singleton instance
export const walletService = WalletService.getInstance();
