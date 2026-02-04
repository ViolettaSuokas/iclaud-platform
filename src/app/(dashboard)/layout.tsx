import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      credits: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="gradient-mesh" />
      <div className="grid-bg fixed inset-0 z-[-1]" />

      <Sidebar credits={user.credits} />
      <div className="pl-64">
        <Header user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
