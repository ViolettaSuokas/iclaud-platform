import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';

const createDatabaseSchema = z.object({
  name: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  type: z.enum(['postgresql', 'mysql', 'mongodb', 'redis']),
  version: z.string().optional(),
  projectId: z.string().optional(),
  storage: z.string().default('1Gi'),
});

const defaultVersions: Record<string, string> = {
  postgresql: '15',
  mysql: '8',
  mongodb: '6',
  redis: '7',
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const databases = await prisma.database.findMany({
      where: { userId: session.user.id },
      include: {
        project: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(databases);
  } catch (error) {
    console.error('Error fetching databases:', error);
    return NextResponse.json({ error: 'Failed to fetch databases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createDatabaseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // If projectId provided, verify it belongs to user
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, userId: session.user.id },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
    }

    // Check if database with same name exists for user
    const existing = await prisma.database.findUnique({
      where: { userId_name: { userId: session.user.id, name: data.name } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Database with this name already exists' }, { status: 409 });
    }

    // Generate credentials
    const dbId = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomBytes(16).toString('base64');
    const username = `user_${dbId}`;

    const database = await prisma.database.create({
      data: {
        name: data.name,
        type: data.type,
        version: data.version || defaultVersions[data.type],
        projectId: data.projectId,
        userId: session.user.id,
        storage: data.storage,
        status: 'stopped',
        host: `${data.name}-${dbId}.db.internal`,
        port: data.type === 'postgresql' ? 5432 : data.type === 'mysql' ? 3306 : data.type === 'mongodb' ? 27017 : 6379,
        username: data.type !== 'redis' ? username : undefined,
        password: data.type !== 'redis' ? password : undefined,
        database: data.type !== 'redis' ? data.name.replace(/-/g, '_') : undefined,
      },
      include: {
        project: { select: { name: true } },
      },
    });

    return NextResponse.json(database, { status: 201 });
  } catch (error) {
    console.error('Error creating database:', error);
    return NextResponse.json({ error: 'Failed to create database' }, { status: 500 });
  }
}
