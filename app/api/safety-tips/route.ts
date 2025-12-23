import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const safetyTips = await prisma.safetyTip.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(safetyTips);
  } catch (error) {
    console.error('Error fetching safety tips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch safety tips' },
      { status: 500 }
    );
  }
}

