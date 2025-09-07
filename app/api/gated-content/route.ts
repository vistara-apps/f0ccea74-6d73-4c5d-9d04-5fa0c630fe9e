import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { z } from 'zod';

// Validation schemas
const createGatedContentSchema = z.object({
  creatorId: z.string().min(1),
  secretContent: z.string().min(1).max(5000),
  minTipAmount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Minimum tip amount must be a positive number'),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  unlockLimit: z.number().positive().optional(),
});

const checkUnlockSchema = z.object({
  contentId: z.string().min(1),
  tipperAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createGatedContentSchema.parse(body);

    // Generate unique content ID
    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const gatedContent = await dbHelpers.createGatedContent({
      content_id: contentId,
      creator_id: validatedData.creatorId,
      secret_content: validatedData.secretContent,
      min_tip_amount: validatedData.minTipAmount,
      title: validatedData.title,
      description: validatedData.description,
      unlock_limit: validatedData.unlockLimit || null,
    });

    return NextResponse.json({ success: true, content: gatedContent });
  } catch (error) {
    console.error('Error creating gated content:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create gated content' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const gatedContent = await dbHelpers.getGatedContent(creatorId);

    // Don't return secret content in list view
    const publicContent = gatedContent.map(content => ({
      ...content,
      secret_content: undefined, // Remove secret content from list
    }));

    return NextResponse.json({ success: true, content: publicContent });
  } catch (error) {
    console.error('Error fetching gated content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gated content' },
      { status: 500 }
    );
  }
}
