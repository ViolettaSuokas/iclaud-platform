import { prisma } from '@/lib/db';
import { dockerManager } from './docker-manager';

interface AgentMetrics {
  cpu: number;
  memory: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
  timestamp: Date;
}

interface AggregatedMetrics {
  totalAgents: number;
  runningAgents: number;
  stoppedAgents: number;
  errorAgents: number;
  totalCpu: number;
  totalMemory: number;
  averageCpu: number;
  averageMemory: number;
}

interface CloudMetrics {
  cloudId: string;
  cloudName: string;
  agentCount: number;
  runningCount: number;
  totalCpu: number;
  totalMemory: number;
}

export class MetricsCollector {
  async collectAgentMetrics(agentId: string): Promise<AgentMetrics | null> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent || !agent.containerId || agent.status !== 'running') {
      return null;
    }

    const stats = await dockerManager.getContainerStats(agent.containerId);

    return {
      ...stats,
      timestamp: new Date(),
    };
  }

  async collectUserMetrics(userId: string): Promise<AggregatedMetrics> {
    const agents = await prisma.agent.findMany({
      where: {
        cloud: { userId },
      },
    });

    const runningAgents = agents.filter((a) => a.status === 'running');
    const stoppedAgents = agents.filter((a) => a.status === 'stopped');
    const errorAgents = agents.filter((a) => a.status === 'error');

    let totalCpu = 0;
    let totalMemory = 0;

    for (const agent of runningAgents) {
      if (agent.containerId) {
        const stats = await dockerManager.getContainerStats(agent.containerId);
        totalCpu += stats.cpu;
        totalMemory += stats.memory;
      }
    }

    return {
      totalAgents: agents.length,
      runningAgents: runningAgents.length,
      stoppedAgents: stoppedAgents.length,
      errorAgents: errorAgents.length,
      totalCpu,
      totalMemory,
      averageCpu: runningAgents.length > 0 ? totalCpu / runningAgents.length : 0,
      averageMemory: runningAgents.length > 0 ? totalMemory / runningAgents.length : 0,
    };
  }

  async collectCloudMetrics(userId: string): Promise<CloudMetrics[]> {
    const clouds = await prisma.cloud.findMany({
      where: { userId },
      include: {
        agents: true,
      },
    });

    const metrics: CloudMetrics[] = [];

    for (const cloud of clouds) {
      const runningAgents = cloud.agents.filter((a) => a.status === 'running');
      let totalCpu = 0;
      let totalMemory = 0;

      for (const agent of runningAgents) {
        if (agent.containerId) {
          const stats = await dockerManager.getContainerStats(agent.containerId);
          totalCpu += stats.cpu;
          totalMemory += stats.memory;
        }
      }

      metrics.push({
        cloudId: cloud.id,
        cloudName: cloud.name,
        agentCount: cloud.agents.length,
        runningCount: runningAgents.length,
        totalCpu,
        totalMemory,
      });
    }

    return metrics;
  }

  async getRealtimeMetrics(agentId: string): Promise<AsyncGenerator<AgentMetrics>> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent || !agent.containerId) {
      throw new Error('Agent not found or not running');
    }

    const self = this;

    return (async function* () {
      while (true) {
        const metrics = await self.collectAgentMetrics(agentId);
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
