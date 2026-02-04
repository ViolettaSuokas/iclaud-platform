import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const cloudSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Name can only contain letters, numbers, hyphens, and underscores'),
  region: z.enum(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1'], {
    message: 'Please select a valid region',
  }),
});

export const agentSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Name can only contain letters, numbers, hyphens, and underscores'),
  runtime: z.enum(['PYTHON', 'NODEJS', 'DOCKER'], {
    message: 'Please select a valid runtime',
  }),
  cloudId: z.string().min(1, 'Cloud ID is required'),
  config: z.record(z.string(), z.unknown()).optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  code: z.string().optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
});

export const chainSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  agentIds: z.array(z.string()).min(2, 'Chain must have at least 2 agents'),
  config: z.object({
    steps: z.array(
      z.object({
        agentId: z.string(),
        input: z.record(z.string(), z.unknown()).optional(),
        condition: z.string().optional(),
      })
    ),
    errorHandling: z.enum(['stop', 'continue', 'retry']).optional(),
    timeout: z.number().positive().optional(),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CloudInput = z.infer<typeof cloudSchema>;
export type AgentInput = z.infer<typeof agentSchema>;
export type ChainInput = z.infer<typeof chainSchema>;
