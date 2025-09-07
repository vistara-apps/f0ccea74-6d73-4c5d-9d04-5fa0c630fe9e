import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      creators: {
        Row: {
          creator_id: string;
          wallet_address: string;
          bio: string;
          content: string;
          name: string | null;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          creator_id: string;
          wallet_address: string;
          bio: string;
          content: string;
          name?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          creator_id?: string;
          wallet_address?: string;
          bio?: string;
          content?: string;
          name?: string | null;
          avatar?: string | null;
          updated_at?: string;
        };
      };
      tips: {
        Row: {
          tip_id: string;
          creator_id: string;
          tipper_address: string;
          amount: string;
          currency: string;
          timestamp: string;
          message: string | null;
          unlocked_content_id: string | null;
          transaction_hash: string | null;
          status: 'pending' | 'confirmed' | 'failed';
          created_at: string;
        };
        Insert: {
          tip_id: string;
          creator_id: string;
          tipper_address: string;
          amount: string;
          currency: string;
          timestamp?: string;
          message?: string | null;
          unlocked_content_id?: string | null;
          transaction_hash?: string | null;
          status?: 'pending' | 'confirmed' | 'failed';
          created_at?: string;
        };
        Update: {
          tip_id?: string;
          creator_id?: string;
          tipper_address?: string;
          amount?: string;
          currency?: string;
          timestamp?: string;
          message?: string | null;
          unlocked_content_id?: string | null;
          transaction_hash?: string | null;
          status?: 'pending' | 'confirmed' | 'failed';
        };
      };
      gated_content: {
        Row: {
          content_id: string;
          creator_id: string;
          secret_content: string;
          min_tip_amount: string;
          unlock_limit: number | null;
          title: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          content_id: string;
          creator_id: string;
          secret_content: string;
          min_tip_amount: string;
          unlock_limit?: number | null;
          title: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content_id?: string;
          creator_id?: string;
          secret_content?: string;
          min_tip_amount?: string;
          unlock_limit?: number | null;
          title?: string;
          description?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export const dbHelpers = {
  // Creator operations
  async createCreator(creator: Database['public']['Tables']['creators']['Insert']) {
    const { data, error } = await supabase
      .from('creators')
      .insert(creator)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCreator(creatorId: string) {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('creator_id', creatorId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCreator(creatorId: string, updates: Database['public']['Tables']['creators']['Update']) {
    const { data, error } = await supabase
      .from('creators')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('creator_id', creatorId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Tip operations
  async createTip(tip: Database['public']['Tables']['tips']['Insert']) {
    const { data, error } = await supabase
      .from('tips')
      .insert(tip)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTipsForCreator(creatorId: string, limit = 10) {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('status', 'confirmed')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async updateTipStatus(tipId: string, status: 'pending' | 'confirmed' | 'failed', transactionHash?: string) {
    const updates: any = { status };
    if (transactionHash) updates.transaction_hash = transactionHash;

    const { data, error } = await supabase
      .from('tips')
      .update(updates)
      .eq('tip_id', tipId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Gated content operations
  async createGatedContent(content: Database['public']['Tables']['gated_content']['Insert']) {
    const { data, error } = await supabase
      .from('gated_content')
      .insert(content)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getGatedContent(creatorId: string) {
    const { data, error } = await supabase
      .from('gated_content')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Analytics
  async getCreatorStats(creatorId: string) {
    const { data: tips, error } = await supabase
      .from('tips')
      .select('amount, currency')
      .eq('creator_id', creatorId)
      .eq('status', 'confirmed');
    
    if (error) throw error;

    const totalTips = tips.length;
    const totalAmount = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0);
    
    return {
      totalTips,
      totalAmount: totalAmount.toString(),
      currency: tips[0]?.currency || 'ETH'
    };
  }
};
