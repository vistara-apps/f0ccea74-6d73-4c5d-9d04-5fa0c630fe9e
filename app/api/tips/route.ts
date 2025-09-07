import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { z } from 'zod';

// Validation schemas
const createTipSchema = z.object({
  creatorId: z.string().min(1),
  tipperAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Amount must be a positive number'),
  currency: z.string().min(1),
  message: z.string().max(280).optional(),
  transactionHash: z.string().optional(),
});

const updateTipStatusSchema = z.object({
  tipId: z.string().min(1),
  status: z.enum(['pending', 'confirmed', 'failed']),
  transactionHash: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTipSchema.parse(body);

    // Generate unique tip ID
    const tipId = `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const tip = await dbHelpers.createTip({
      tip_id: tipId,
      creator_id: validatedData.creatorId,
      tipper_address: validatedData.tipperAddress,
      amount: validatedData.amount,
      currency: validatedData.currency,
      message: validatedData.message || null,
      transaction_hash: validatedData.transactionHash || null,
      status: 'pending',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, tip });
  } catch (error) {
    console.error('Error creating tip:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create tip' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const tips = await dbHelpers.getTipsForCreator(creatorId, limit);

    return NextResponse.json({ success: true, tips });
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tips' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateTipStatusSchema.parse(body);

    const updatedTip = await dbHelpers.updateTipStatus(
      validatedData.tipId,
      validatedData.status,
      validatedData.transactionHash
    );

    return NextResponse.json({ success: true, tip: updatedTip });
  } catch (error) {
    console.error('Error updating tip status:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update tip status' },
      { status: 500 }
    );
  }
}
