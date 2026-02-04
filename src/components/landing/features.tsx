'use client';

import {
  Cloud,
  Cpu,
  GitBranch,
  Shield,
  Activity,
  Webhook,
  Terminal,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Cloud,
    title: 'Multi-Cloud Deployment',
    description:
      'Deploy agents across multiple cloud regions. Choose from US, EU, or Asia-Pacific for optimal latency.',
  },
  {
    icon: Cpu,
    title: 'Auto-Detect Runtime',
    description:
      'We automatically detect Python, Node.js, or Docker environments and configure the optimal runtime.',
  },
  {
    icon: GitBranch,
    title: 'Agent Chains',
    description:
      'Connect multiple agents into powerful workflows. Chain outputs to inputs with visual builder.',
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description:
      'Monitor CPU, memory, and network in real-time. Get instant alerts when something goes wrong.',
  },
  {
    icon: Shield,
    title: 'ShellGuard Security',
    description:
      'Enterprise-grade security with DDoS protection, rate limiting, and automatic threat detection.',
  },
  {
    icon: Webhook,
    title: 'Webhooks & API',
    description:
      'Full REST API access with webhooks for events. Integrate with your existing tools seamlessly.',
  },
  {
    icon: Terminal,
    title: 'Live Logs',
    description:
      'Stream logs in real-time directly from your dashboard. Debug issues instantly without SSH.',
  },
  {
    icon: Lock,
    title: 'Environment Variables',
    description:
      'Securely store API keys and secrets. Inject environment variables at runtime.',
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32" id="features">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to deploy AI agents
          </h2>
          <p className="text-lg text-muted-foreground">
            From development to production, we handle the infrastructure so you can focus on building.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
