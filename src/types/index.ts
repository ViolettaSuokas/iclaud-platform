export type AppStatus = 'stopped' | 'running' | 'deploying' | 'building' | 'error';
export type DatabaseStatus = 'stopped' | 'running' | 'creating' | 'error';
export type DeploymentStatus = 'pending' | 'building' | 'success' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  apps?: App[];
  databases?: Database[];
}

export interface App {
  id: string;
  name: string;
  status: AppStatus;
  runtime: string;
  projectId: string;
  templateId: string | null;
  sourceType: string;
  gitUrl: string | null;
  gitBranch: string;
  dockerImage: string | null;
  envVars: string | null;
  port: number;
  replicas: number;
  cpu: string;
  memory: string;
  storage: string;
  domain: string | null;
  customDomain: string | null;
  ssl: boolean;
  containerId: string | null;
  internalUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  template?: Template;
  deployments?: Deployment[];
}

export interface Database {
  id: string;
  name: string;
  type: string;
  version: string;
  status: DatabaseStatus;
  projectId: string | null;
  userId: string;
  storage: string;
  host: string | null;
  port: number | null;
  username: string | null;
  password: string | null;
  database: string | null;
  containerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  runtime: string;
  gitUrl: string | null;
  dockerImage: string | null;
  defaultEnv: string | null;
  defaultPort: number;
  minCpu: string;
  minMemory: string;
  docsUrl: string | null;
  websiteUrl: string | null;
  tags: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deployment {
  id: string;
  appId: string;
  userId: string;
  status: DeploymentStatus;
  commitHash: string | null;
  commitMsg: string | null;
  buildLogs: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  createdAt: Date;
  app?: App;
}

export interface AppMetrics {
  cpu: number;
  memory: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
  timestamp: Date;
}

export interface AppLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface CreateAppInput {
  name: string;
  projectId: string;
  templateId?: string;
  runtime?: string;
  sourceType?: 'git' | 'docker';
  gitUrl?: string;
  gitBranch?: string;
  dockerImage?: string;
  port?: number;
  envVars?: string;
}

export interface CreateDatabaseInput {
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  version?: string;
  projectId?: string;
  storage?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
