import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.securityEvent.deleteMany();
  await prisma.agentLog.deleteMany();
  await prisma.chainAgent.deleteMany();
  await prisma.chain.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.cloud.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo123!', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@iclaud.ai',
      name: 'Demo User',
      password: hashedPassword,
      credits: 24.50,
      plan: 'free',
      apiKey: 'iclaud_sk_demo_12345678',
    },
  });

  console.log('Created user:', user.email);

  // Create clouds (regions)
  const clouds = await Promise.all([
    prisma.cloud.create({
      data: {
        name: 'US East Production',
        region: 'us-east-1',
        status: 'active',
        userId: user.id,
      },
    }),
    prisma.cloud.create({
      data: {
        name: 'EU West Staging',
        region: 'eu-west-1',
        status: 'active',
        userId: user.id,
      },
    }),
    prisma.cloud.create({
      data: {
        name: 'Asia Pacific',
        region: 'ap-southeast-1',
        status: 'active',
        userId: user.id,
      },
    }),
  ]);

  console.log('Created clouds:', clouds.length);

  // Create agents
  const agents = await Promise.all([
    // US East agents
    prisma.agent.create({
      data: {
        name: 'GPT-Summarizer',
        description: 'Summarizes long documents and articles using GPT-4',
        status: 'running',
        runtime: 'python',
        cloudId: clouds[0].id,
        endpoint: 'https://gpt-summarizer.iclaud.run',
        port: 8000,
        cpu: '0.5',
        memory: '512Mi',
        totalCalls: 1247,
        avgResponse: 1.23,
        lastCallAt: new Date(),
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Code-Reviewer',
        description: 'Automated code review agent with best practices analysis',
        status: 'running',
        runtime: 'nodejs',
        cloudId: clouds[0].id,
        endpoint: 'https://code-reviewer.iclaud.run',
        port: 3000,
        cpu: '1.0',
        memory: '1Gi',
        totalCalls: 856,
        avgResponse: 2.45,
        lastCallAt: new Date(Date.now() - 1000 * 60 * 5),
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Data-Scraper',
        description: 'Web scraping agent with anti-bot detection bypass',
        status: 'running',
        runtime: 'python',
        cloudId: clouds[0].id,
        endpoint: 'https://data-scraper.iclaud.run',
        port: 8000,
        cpu: '0.25',
        memory: '256Mi',
        totalCalls: 3421,
        avgResponse: 0.89,
        lastCallAt: new Date(Date.now() - 1000 * 60 * 2),
      },
    }),
    // EU West agents
    prisma.agent.create({
      data: {
        name: 'Sentiment-Analyzer',
        description: 'Multi-language sentiment analysis for social media',
        status: 'running',
        runtime: 'python',
        cloudId: clouds[1].id,
        endpoint: 'https://sentiment-analyzer.iclaud.run',
        port: 8000,
        cpu: '0.5',
        memory: '512Mi',
        totalCalls: 567,
        avgResponse: 0.45,
        lastCallAt: new Date(Date.now() - 1000 * 60 * 10),
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Image-Classifier',
        description: 'Computer vision agent for image classification',
        status: 'stopped',
        runtime: 'python',
        cloudId: clouds[1].id,
        port: 8000,
        cpu: '2.0',
        memory: '4Gi',
        totalCalls: 234,
        avgResponse: 3.21,
      },
    }),
    // Asia Pacific agents
    prisma.agent.create({
      data: {
        name: 'Translation-Bot',
        description: 'Real-time translation agent supporting 50+ languages',
        status: 'running',
        runtime: 'python',
        cloudId: clouds[2].id,
        endpoint: 'https://translation-bot.iclaud.run',
        port: 8000,
        cpu: '1.0',
        memory: '1Gi',
        totalCalls: 2103,
        avgResponse: 0.67,
        lastCallAt: new Date(Date.now() - 1000 * 30),
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Content-Publisher',
        description: 'Automated content publishing to multiple platforms',
        status: 'deploying',
        runtime: 'nodejs',
        cloudId: clouds[2].id,
        port: 3000,
        cpu: '0.5',
        memory: '512Mi',
        totalCalls: 0,
        avgResponse: 0,
      },
    }),
  ]);

  console.log('Created agents:', agents.length);

  // Create chains
  const chains = await Promise.all([
    prisma.chain.create({
      data: {
        name: 'Content Pipeline',
        description: 'Scrape → Summarize → Publish workflow',
        status: 'active',
        userId: user.id,
        executions: 342,
        avgDuration: 4.56,
        lastRunAt: new Date(Date.now() - 1000 * 60 * 15),
        agents: {
          create: [
            { agentId: agents[2].id, order: 0 }, // Data-Scraper
            { agentId: agents[0].id, order: 1 }, // GPT-Summarizer
          ],
        },
      },
    }),
    prisma.chain.create({
      data: {
        name: 'Translation Flow',
        description: 'Translate → Analyze Sentiment workflow',
        status: 'active',
        userId: user.id,
        executions: 156,
        avgDuration: 1.89,
        lastRunAt: new Date(Date.now() - 1000 * 60 * 30),
        agents: {
          create: [
            { agentId: agents[5].id, order: 0 }, // Translation-Bot
            { agentId: agents[3].id, order: 1 }, // Sentiment-Analyzer
          ],
        },
      },
    }),
    prisma.chain.create({
      data: {
        name: 'Code Review Pipeline',
        description: 'Automated PR review workflow',
        status: 'inactive',
        userId: user.id,
        executions: 89,
        avgDuration: 5.34,
        agents: {
          create: [
            { agentId: agents[1].id, order: 0 }, // Code-Reviewer
          ],
        },
      },
    }),
  ]);

  console.log('Created chains:', chains.length);

  // Create security events
  await prisma.securityEvent.createMany({
    data: [
      // Traditional security threats
      {
        type: 'ddos_attempt',
        severity: 'high',
        source: '185.220.101.42',
        target: 'gpt-summarizer.iclaud.run',
        description: 'DDoS attack blocked - 10,000 requests/sec from botnet',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        type: 'brute_force',
        severity: 'medium',
        source: '103.45.67.89',
        target: 'API Auth',
        description: 'Brute force login attempt - 50 failed attempts',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        type: 'rate_limit',
        severity: 'low',
        source: '45.33.32.156',
        target: 'code-reviewer.iclaud.run',
        description: 'Rate limit exceeded - throttled to 100 req/min',
        blocked: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        type: 'sql_injection',
        severity: 'high',
        source: '91.240.118.222',
        target: 'data-scraper.iclaud.run',
        description: 'SQL injection attempt: DROP TABLE users; --',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
      },
      {
        type: 'unauthorized_access',
        severity: 'high',
        source: '78.46.89.123',
        target: 'sentiment-analyzer.iclaud.run',
        description: 'Unauthorized API key usage attempt blocked',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
      },
      // AI-specific security threats
      {
        type: 'prompt_injection',
        severity: 'high',
        source: '185.173.35.18',
        target: 'gpt-summarizer.iclaud.run',
        description: 'Prompt injection detected: "Ignore previous instructions and..."',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        type: 'prompt_injection',
        severity: 'high',
        source: '103.21.244.0',
        target: 'code-reviewer.iclaud.run',
        description: 'Malicious prompt attempting to extract system instructions',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 75),
      },
      {
        type: 'data_leakage',
        severity: 'medium',
        source: '192.99.34.56',
        target: 'sentiment-analyzer.iclaud.run',
        description: 'Attempted extraction of training data patterns',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 180),
      },
      {
        type: 'data_leakage',
        severity: 'high',
        source: '45.77.65.89',
        target: 'gpt-summarizer.iclaud.run',
        description: 'PII exfiltration attempt via crafted prompts blocked',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 240),
      },
      {
        type: 'jailbreak_attempt',
        severity: 'high',
        source: '202.61.236.12',
        target: 'code-reviewer.iclaud.run',
        description: 'Jailbreak attempt: DAN (Do Anything Now) prompt pattern',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 300),
      },
      {
        type: 'jailbreak_attempt',
        severity: 'medium',
        source: '177.54.32.78',
        target: 'gpt-summarizer.iclaud.run',
        description: 'Role-play based jailbreak attempt intercepted',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 360),
      },
      // More geographic diversity
      {
        type: 'ddos_attempt',
        severity: 'medium',
        source: '103.152.220.44',
        target: 'data-scraper.iclaud.run',
        description: 'Layer 7 DDoS attack mitigated - HTTP flood',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        type: 'brute_force',
        severity: 'low',
        source: '185.56.80.65',
        target: 'API Auth',
        description: 'Credential stuffing attempt from known botnet IP',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      },
      {
        type: 'suspicious_payload',
        severity: 'medium',
        source: '91.134.232.98',
        target: 'sentiment-analyzer.iclaud.run',
        description: 'XSS payload detected in input parameters',
        blocked: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
    ],
  });

  console.log('Created security events');

  // Create agent logs - realistic logs for demo
  await prisma.agentLog.createMany({
    data: [
      // GPT-Summarizer logs
      {
        agentId: agents[0].id,
        type: 'success',
        message: 'Agent started successfully',
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        agentId: agents[0].id,
        type: 'info',
        message: 'Loaded model: gpt-4-turbo',
        createdAt: new Date(Date.now() - 1000 * 60 * 59),
      },
      {
        agentId: agents[0].id,
        type: 'info',
        message: 'Processing request: summarize 15-page PDF document',
        metadata: JSON.stringify({ tokens: 4521, estimatedCost: 0.045 }),
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        agentId: agents[0].id,
        type: 'success',
        message: 'Request completed in 1.23s',
        metadata: JSON.stringify({ inputTokens: 4521, outputTokens: 856 }),
        createdAt: new Date(Date.now() - 1000 * 60 * 29),
      },
      {
        agentId: agents[0].id,
        type: 'info',
        message: 'Processing request: summarize news article',
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        agentId: agents[0].id,
        type: 'success',
        message: 'Request completed in 0.89s',
        createdAt: new Date(Date.now() - 1000 * 60 * 14),
      },
      {
        agentId: agents[0].id,
        type: 'info',
        message: 'Health check passed',
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
      },

      // Code-Reviewer logs
      {
        agentId: agents[1].id,
        type: 'success',
        message: 'Agent started successfully',
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
      },
      {
        agentId: agents[1].id,
        type: 'info',
        message: 'Connected to GitHub API',
        createdAt: new Date(Date.now() - 1000 * 60 * 119),
      },
      {
        agentId: agents[1].id,
        type: 'info',
        message: 'Reviewing PR #142: "Add user authentication"',
        metadata: JSON.stringify({ repo: 'myapp/backend', files: 12 }),
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        agentId: agents[1].id,
        type: 'warning',
        message: 'Found 3 potential security issues in auth.ts',
        metadata: JSON.stringify({ issues: ['SQL injection risk', 'Weak password policy', 'Missing rate limit'] }),
        createdAt: new Date(Date.now() - 1000 * 60 * 44),
      },
      {
        agentId: agents[1].id,
        type: 'success',
        message: 'Review completed, posted 5 comments',
        createdAt: new Date(Date.now() - 1000 * 60 * 43),
      },
      {
        agentId: agents[1].id,
        type: 'warning',
        message: 'High memory usage detected: 85%',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },

      // Data-Scraper logs
      {
        agentId: agents[2].id,
        type: 'success',
        message: 'Agent started successfully',
        createdAt: new Date(Date.now() - 1000 * 60 * 180),
      },
      {
        agentId: agents[2].id,
        type: 'info',
        message: 'Scraping job started: e-commerce prices',
        metadata: JSON.stringify({ urls: 150, proxy: 'rotating' }),
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
      },
      {
        agentId: agents[2].id,
        type: 'warning',
        message: 'Rate limited by target site, backing off',
        createdAt: new Date(Date.now() - 1000 * 60 * 18),
      },
      {
        agentId: agents[2].id,
        type: 'success',
        message: 'Scraping completed: 147/150 URLs processed',
        metadata: JSON.stringify({ success: 147, failed: 3, duration: '45s' }),
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      },

      // Deploying agent logs
      {
        agentId: agents[6].id,
        type: 'info',
        message: 'Deployment started',
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        agentId: agents[6].id,
        type: 'info',
        message: 'Building container image...',
        createdAt: new Date(Date.now() - 1000 * 60 * 4),
      },
      {
        agentId: agents[6].id,
        type: 'info',
        message: 'Installing dependencies: npm install',
        createdAt: new Date(Date.now() - 1000 * 60 * 3),
      },
      {
        agentId: agents[6].id,
        type: 'info',
        message: 'Running health checks...',
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
      },
    ],
  });

  console.log('Created agent logs');

  console.log('');
  console.log('Database seeded successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('   Email:    demo@iclaud.ai');
  console.log('   Password: Demo123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
