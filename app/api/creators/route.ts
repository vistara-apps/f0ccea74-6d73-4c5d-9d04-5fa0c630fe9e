import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { z } from 'zod';

// Validation schemas
const createCreatorSchema = z.object({
  creatorId: z.string().min(1),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  bio: z.string().min(1).max(500),
  content: z.string().min(1).max(1000),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

const updateCreatorSchema = z.object({
  bio: z.string().min(1).max(500).optional(),
  content: z.string().min(1).max(1000).optional(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCreatorSchema.parse(body);

    const creator = await dbHelpers.createCreator({
      creator_id: validatedData.creatorId,
      wallet_address: validatedData.walletAddress,
      bio: validatedData.bio,
      content: validatedData.content,
      name: validatedData.name || null,
      avatar: validatedData.avatar || null,
    });

    return NextResponse.json({ success: true, creator });
  } catch (error) {
    console.error('Error creating creator:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create creator' },
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

    const creator = await dbHelpers.getCreator(creatorId);
    const stats = await dbHelpers.getCreatorStats(creatorId);

    return NextResponse.json({ 
      success: true, 
      creator: {
        ...creator,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching creator:', error);
    return NextResponse.json(
      { success: false, error: 'Creator not found' },
      { status: 404 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { creatorId, ...updates } = body;

    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const validatedUpdates = updateCreatorSchema.parse(updates);
    const updatedCreator = await dbHelpers.updateCreator(creatorId, validatedUpdates);

    return NextResponse.json({ success: true, creator: updatedCreator });
  } catch (error) {
    console.error('Error updating creator:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update creator' },
      { status: 500 }
    );
  }
}
