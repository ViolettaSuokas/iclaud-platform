import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Cloud, Plus, Globe, Server, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const regionLabels: Record<string, { name: string; flag: string }> = {
  'us-east-1': { name: 'US East (N. Virginia)', flag: '🇺🇸' },
  'us-west-2': { name: 'US West (Oregon)', flag: '🇺🇸' },
  'eu-west-1': { name: 'EU West (Ireland)', flag: '🇪🇺' },
  'eu-central-1': { name: 'EU Central (Frankfurt)', flag: '🇩🇪' },
  'ap-southeast-1': { name: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
  'ap-northeast-1': { name: 'Asia Pacific (Tokyo)', flag: '🇯🇵' },
};

export default async function CloudsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const clouds = await prisma.cloud.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { agents: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clouds</h2>
          <p className="text-muted-foreground">
            Manage your cloud infrastructure and regions
          </p>
        </div>
        <Button
          asChild
          className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#05050a] font-semibold text-xs uppercase tracking-wider"
        >
          <Link href="/clouds/new">
            <Plus className="h-4 w-4 mr-2" />
            New Cloud
          </Link>
        </Button>
      </div>

      {clouds.length === 0 ? (
        <div className="crypto-card rounded-lg p-12 text-center">
          <div className="h-16 w-16 rounded-lg bg-[#00d4ff]/15 flex items-center justify-center mx-auto mb-4">
            <Cloud className="h-8 w-8 text-[#00d4ff]" />
          </div>
          <h3 className="text-lg font-medium mb-2">No clouds yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first cloud to start deploying AI agents
          </p>
          <Button
            asChild
            className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#05050a] font-semibold"
          >
            <Link href="/clouds/new">Create Cloud</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clouds.map((cloud) => {
            const region = regionLabels[cloud.region] || { name: cloud.region, flag: '🌍' };

            return (
              <Link
                key={cloud.id}
                href={`/clouds/${cloud.id}`}
                className="crypto-card rounded-lg p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#00d4ff]/15 flex items-center justify-center">
                      <Cloud className="h-5 w-5 text-[#00d4ff]" />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-[#00d4ff] transition-colors">
                        {cloud.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{region.flag}</span>
                        <span>{region.name}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: cloud.status === 'active' ? '#00ff88' : '#6b6b80',
                      boxShadow: cloud.status === 'active' ? '0 0 8px rgba(0,255,136,0.6)' : 'none',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Server className="h-4 w-4" />
                    <span>{cloud._count.agents} agents</span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {cloud.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
