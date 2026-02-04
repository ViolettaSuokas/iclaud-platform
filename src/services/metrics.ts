import { prisma } from '@/lib/db';
import { dockerManager } from './docker-manager';

interface AppMetrics {
  cpu: number;
  memory: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
  timestamp: Date;
}

interface AggregatedMetrics {
  totalApps: number;
  runningApps: number;
  stoppedApps: number;
  errorApps: number;
  totalCpu: number;
  totalMemory: number;
  averageCpu: number;
  averageMemory: number;
}

interface ProjectMetrics {
  projectId: string;
  projectName: string;
  appCount: number;
  runningCount: number;
  totalCpu: number;
  totalMemory: number;
}

export class MetricsCollector {
  async collectAppMetrics(appId: string): Promise<AppMetrics | null> {
    const app = await prisma.app.findUnique({
      where: { id: appId },
    });

    if (!app || !app.containerId || app.status !== 'running') {
      return null;
    }

    const stats = await dockerManager.getContainerStats(app.containerId);

    return {
      ...stats,
      timestamp: new Date(),
    };
  }

  async collectUserMetrics(userId: string): Promise<AggregatedMetrics> {
    const apps = await prisma.app.findMany({
      where: {
        project: { userId },
      },
    });

    const runningApps = apps.filter((a) => a.status === 'running');
    const stoppedApps = apps.filter((a) => a.status === 'stopped');
    const errorApps = apps.filter((a) => a.status === 'error');

    let totalCpu = 0;
    let totalMemory = 0;

    for (const app of runningApps) {
      if (app.containerId) {
        const stats = await dockerManager.getContainerStats(app.containerId);
        totalCpu += stats.cpu;
        totalMemory += stats.memory;
      }
    }

    return {
      totalApps: apps.length,
      runningApps: runningApps.length,
      stoppedApps: stoppedApps.length,
      errorApps: errorApps.length,
      totalCpu,
      totalMemory,
      averageCpu: runningApps.length > 0 ? totalCpu / runningApps.length : 0,
      averageMemory: runningApps.length > 0 ? totalMemory / runningApps.length : 0,
    };
  }

  async collectProjectMetrics(userId: string): Promise<ProjectMetrics[]> {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        apps: true,
      },
    });

    const metrics: ProjectMetrics[] = [];

    for (const project of projects) {
      const runningApps = project.apps.filter((a) => a.status === 'running');
      let totalCpu = 0;
      let totalMemory = 0;

      for (const app of runningApps) {
        if (app.containerId) {
          const stats = await dockerManager.getContainerStats(app.containerId);
          totalCpu += stats.cpu;
          totalMemory += stats.memory;
        }
      }

      metrics.push({
        projectId: project.id,
        projectName: project.name,
        appCount: project.apps.length,
        runningCount: runningApps.length,
        totalCpu,
        totalMemory,
      });
    }

    return metrics;
  }

  async getRealtimeMetrics(appId: string): Promise<AsyncGenerator<AppMetrics>> {
    const app = await prisma.app.findUnique({
      where: { id: appId },
    });

    if (!app || !app.containerId) {
      throw new Error('App not found or not running');
    }

    const self = this;

    return (async function* () {
      while (true) {
        const metrics = await self.collectAppMetrics(appId);
        if (metrics) {
          yield metrics;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    })();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatCpu(cpu: number): string {
    return `${cpu.toFixed(2)}%`;
  }
}

export const metricsCollector = new MetricsCollector();
