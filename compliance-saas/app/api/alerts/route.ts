import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Collections } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { withCache } from '@/lib/utils/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    return await withCache(
      `alerts:${organizationId}`,
      async () => {
        const { db } = await connectToDatabase();
        const alerts = await db
          .collection(Collections.ALERTS)
          .find({ organizationId: new ObjectId(organizationId) })
          .sort({ timestamp: -1 })
          .limit(50)
          .toArray();

        return NextResponse.json({ data: alerts });
      },
      30 // Cache for 30 seconds
    );
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, message, type, framework, relatedTaskId } = body;

    if (!organizationId || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection(Collections.ALERTS).insertOne({
      organizationId: new ObjectId(organizationId),
      message,
      type,
      framework,
      relatedTaskId: relatedTaskId ? new ObjectId(relatedTaskId) : null,
      timestamp: new Date(),
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
