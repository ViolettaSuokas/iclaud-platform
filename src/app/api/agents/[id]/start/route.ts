import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: { cloud: { select: { userId: true } } },
    });

    if (!agent || agent.cloud.userId !== session.user.id) {
      return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
    }

    // Update status to running
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        status: 'running',
        endpoint: `https://${agent.name.toLowerCase().replace(/\s+/g, '-')}.iclaud.run`,
      },
    });

    // Create log entry
    await prisma.agentLog.create({
      data: {
        agentId: id,
        type: 'success',
        message: 'Agent started successfully',
      },
    });

    return NextResponse.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error('Failed to start agent:', error);
    return NextResponse.json({ message: 'Failed to start agent' }, { status: 500 });
  }
}
