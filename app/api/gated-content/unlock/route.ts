import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const unlockContentSchema = z.object({
  contentId: z.string().min(1),
  tipperAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = unlockContentSchema.parse(body);

    // Get the gated content
    const { data: content, error: contentError } = await supabase
      .from('gated_content')
      .select('*')
      .eq('content_id', validatedData.contentId)
      .single();

    if (contentError || !content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Check if user has tipped enough to unlock this content
    const { data: tips, error: tipsError } = await supabase
      .from('tips')
      .select('amount, currency')
      .eq('creator_id', content.creator_id)
      .eq('tipper_address', validatedData.tipperAddress)
      .eq('status', 'confirmed');

    if (tipsError) {
      return NextResponse.json(
        { success: false, error: 'Failed to check tip history' },
        { status: 500 }
      );
    }

    // Calculate total tips from this user
    const totalTipped = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0);
    const minRequired = parseFloat(content.min_tip_amount);

    if (totalTipped < minRequired) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient tips to unlock content',
        required: content.min_tip_amount,
        current: totalTipped.toString(),
        remaining: (minRequired - totalTipped).toString()
      }, { status: 403 });
    }

    // User has tipped enough, return the secret content
    return NextResponse.json({
      success: true,
      content: {
        content_id: content.content_id,
        title: content.title,
        description: content.description,
        secret_content: content.secret_content,
        unlocked_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error unlocking content:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to unlock content' },
      { status: 500 }
    );
  }
}
