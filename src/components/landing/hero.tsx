'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Github, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-40">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span>Get $5 free credits</span>
            <ArrowRight className="h-3 w-3" />
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            In A Minute.
            <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Build, Deploy & Run
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Deploy any app in seconds. No YAML, no DevOps. Just push your code
            and we handle the rest. Start free with $5 monthly credits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/register">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/templates">
                <Play className="mr-2 h-4 w-4" />
                Browse Templates
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Deploy in 30 seconds</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="rounded-xl border bg-gradient-to-b from-background to-muted/30 p-2 shadow-2xl">
            <div className="rounded-lg border bg-background">
              {/* Browser header */}
              <div className="flex items-center gap-2 border-b px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                  app.crab.cloud/dashboard
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-sm text-muted-foreground">Running Apps</div>
                    <div className="text-3xl font-bold">12</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      All healthy
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-sm text-muted-foreground">Databases</div>
                    <div className="text-3xl font-bold">5</div>
                    <div className="mt-1 text-xs text-muted-foreground">PostgreSQL, Redis</div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-sm text-muted-foreground">Credits</div>
                    <div className="text-3xl font-bold">$4.20</div>
                    <div className="mt-1 text-xs text-muted-foreground">This month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
