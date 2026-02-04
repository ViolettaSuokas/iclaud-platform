'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Terminal, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
        return;
      }

      toast.success('Access granted');
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error('Connection failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00ff88] shadow-lg shadow-[#00ff88]/30">
          <Terminal className="h-6 w-6 text-[#05050a]" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-wider">
            <span className="text-[#00d4ff]">i</span>
            <span className="text-foreground">Claud</span>
          </span>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Agent Cloud
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="crypto-card rounded-xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 bg-white/[0.03] border-white/[0.08] focus:border-[#00ff88]/50 focus:ring-[#00ff88]/20 placeholder:text-muted-foreground/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff3b5c]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-white/[0.03] border-white/[0.08] focus:border-[#00ff88]/50 focus:ring-[#00ff88]/20 placeholder:text-muted-foreground/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff3b5c]" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11 bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#05050a] font-semibold uppercase tracking-wider text-xs shadow-lg shadow-[#00ff88]/25 transition-all duration-200 hover:shadow-[#00ff88]/40 hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Demo credentials */}
        <div className="mt-4 p-3 rounded-md bg-[#00d4ff]/10 border border-[#00d4ff]/20">
          <p className="text-[10px] text-[#00d4ff] uppercase tracking-wider font-medium mb-1">Demo Access</p>
          <p className="text-xs text-muted-foreground font-mono">demo@iclaud.ai / Demo123!</p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[#00ff88] hover:text-[#00ff88]/80 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-foreground hover:text-[#00ff88]">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-foreground hover:text-[#00ff88]">Privacy Policy</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Background */}
      <div className="gradient-mesh" />
      <div className="grid-bg fixed inset-0 z-[-1]" />

      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
