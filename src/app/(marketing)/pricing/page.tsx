import { Header, Pricing, Footer } from '@/components/landing';

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Pricing Plans
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
