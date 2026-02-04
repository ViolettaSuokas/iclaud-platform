import type { App } from '@/types';

interface ContainerConfig {
  name: string;
  image: string;
  env: Record<string, string>;
  ports: { container: number; host: number }[];
  memory?: string;
  cpu?: string;
}

interface ContainerStats {
  cpu: number;
  memory: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
}

const RUNTIME_IMAGES: Record<string, string> = {
  nodejs: 'node:20-alpine',
  python: 'python:3.11-slim',
  go: 'golang:1.21-alpine',
  rust: 'rust:1.74-alpine',
  docker: 'docker:24-dind',
};

const BASE_PORT = 8000;
let portCounter = 0;

function getNextPort(): number {
  portCounter++;
  return BASE_PORT + portCounter;
}

export class DockerManager {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.DOCKER_HOST || 'http://localhost:2375';
  }

  async createContainer(app: App, code?: string): Promise<string> {
    const port = app.port || getNextPort();
    const envVars = app.envVars ? JSON.parse(app.envVars) : {};

    const config: ContainerConfig = {
      name: `app-${app.id}`,
      image: app.dockerImage || RUNTIME_IMAGES[app.runtime] || 'node:20-alpine',
      env: {
        APP_ID: app.id,
        APP_NAME: app.name,
        PORT: port.toString(),
        ...envVars,
      },
      ports: [{ container: port, host: port }],
      memory: app.memory || '512m',
      cpu: app.cpu || '0.5',
    };

    // In production, this would make actual Docker API calls
    // For now, we simulate the container creation
    const containerId = `container-${app.id}-${Date.now()}`;

    console.log(`[DockerManager] Creating container for app ${app.name}`, config);

    return containerId;
  }

  async startContainer(containerId: string): Promise<void> {
    console.log(`[DockerManager] Starting container ${containerId}`);
    // In production: POST /containers/{id}/start
  }

  async stopContainer(containerId: string): Promise<void> {
    console.log(`[DockerManager] Stopping container ${containerId}`);
    // In production: POST /containers/{id}/stop
  }

  async removeContainer(containerId: string): Promise<void> {
    console.log(`[DockerManager] Removing container ${containerId}`);
    // In production: DELETE /containers/{id}
  }

  async getContainerLogs(
    containerId: string,
    options?: { tail?: number; since?: string }
  ): Promise<string[]> {
    console.log(`[DockerManager] Getting logs for container ${containerId}`);

    // Simulated logs for development
    const now = new Date();
    return [
      `[${now.toISOString()}] App started successfully`,
      `[${now.toISOString()}] Listening on port 3000`,
      `[${now.toISOString()}] Ready to accept connections`,
    ];
  }

  async getContainerStats(containerId: string): Promise<ContainerStats> {
    console.log(`[DockerManager] Getting stats for container ${containerId}`);

    // Simulated stats for development
    return {
      cpu: Math.random() * 50,
      memory: Math.random() * 256 * 1024 * 1024,
      memoryLimit: 512 * 1024 * 1024,
      networkRx: Math.random() * 1024 * 1024,
      networkTx: Math.random() * 512 * 1024,
    };
  }

  async inspectContainer(containerId: string): Promise<{
    state: string;
    status: string;
    ports: Record<string, string>;
  }> {
    console.log(`[DockerManager] Inspecting container ${containerId}`);

    return {
      state: 'running',
      status: 'Up 5 minutes',
      ports: { '3000/tcp': '0.0.0.0:3000' },
    };
  }

  async listContainers(filters?: { label?: string }): Promise<string[]> {
    console.log(`[DockerManager] Listing containers`, filters);
    return [];
  }

  async pullImage(image: string): Promise<void> {
    console.log(`[DockerManager] Pulling image ${image}`);
    // In production: POST /images/create?fromImage={image}
  }

  async buildImage(
    dockerfilePath: string,
    tag: string,
    buildArgs?: Record<string, string>
  ): Promise<string> {
    console.log(`[DockerManager] Building image ${tag} from ${dockerfilePath}`);
    return tag;
  }
}

export const dockerManager = new DockerManager();
