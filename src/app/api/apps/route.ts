import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createAppSchema = z.object({
  name: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  projectId: z.string(),
  templateId: z.string().optional(),
  runtime: z.string().default('nodejs'),
  sourceType: z.enum(['git', 'docker']).default('git'),
  gitUrl: z.string().url().optional(),
  gitBranch: z.string().default('main'),
  dockerImage: z.string().optional(),
  port: z.number().int().min(1).max(65535).default(3000),
  envVars: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apps = await prisma.app.findMany({
      where: { project: { userId: session.user.id } },
      include: {
        project: { select: { name: true } },
        template: { select: { name: true, icon: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createAppSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if app with same name exists in project
    const existing = await prisma.app.findUnique({
      where: { projectId_name: { projectId: data.projectId, name: data.name } },
    });

    if (existing) {
      return NextResponse.json({ error: 'App with this name already exists in project' }, { status: 409 });
    }

    // If using template, get template defaults
    let templateDefaults = {};
    if (data.templateId) {
      const template = await prisma.template.findUnique({
        where: { id: data.templateId },
      });
      if (template) {
        templateDefaults = {
          runtime: template.runtime,
          port: template.defaultPort,
          gitUrl: template.gitUrl,
          cpu: template.minCpu,
          memory: template.minMemory,
        };
      }
    }

    const app = await prisma.app.create({
      data: {
        name: data.name,
        projectId: data.projectId,
        templateId: data.templateId,
        runtime: data.runtime,
        sourceType: data.sourceType,
        gitUrl: data.gitUrl,
        gitBranch: data.gitBranch,
        dockerImage: data.dockerImage,
        port: data.port,
        envVars: data.envVars,
        status: 'stopped',
        ...templateDefaults,
      },
      include: {
        project: { select: { name: true } },
        template: { select: { name: true } },
      },
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error('Error creating app:', error);
    return NextResponse.json({ error: 'Failed to create app' }, { status: 500 });
  }
}
