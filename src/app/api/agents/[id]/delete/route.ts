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

    // Delete agent (cascades to logs and chain relations)
    await prisma.agent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete agent:', error);
    return NextResponse.json({ message: 'Failed to delete agent' }, { status: 500 });
  }
}
