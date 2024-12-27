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
      `tasks:${organizationId}`,
      async () => {
        const { db } = await connectToDatabase();
        const tasks = await db
          .collection(Collections.TASKS)
          .find({ organizationId: new ObjectId(organizationId) })
          .sort({ dueDate: 1 })
          .toArray();

        return NextResponse.json({ data: tasks });
      },
      60 // Cache for 1 minute
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, title, dueDate, priority, framework, assignedTo } = body;

    if (!organizationId || !title || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection(Collections.TASKS).insertOne({
      organizationId: new ObjectId(organizationId),
      title,
      dueDate: new Date(dueDate),
      priority,
      framework,
      assignedTo,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    const body = await request.json();
    const { status } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection(Collections.TASKS).updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection(Collections.TASKS).deleteOne({
      _id: new ObjectId(taskId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
