import { Store, Cpu, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marketplace</h2>
          <p className="text-muted-foreground">
            Buy and sell compute resources
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="crypto-card rounded-lg p-12 text-center">
        <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-[#ffcc00]/20 to-[#ff9500]/20 flex items-center justify-center mx-auto mb-6">
          <Store className="h-10 w-10 text-[#ffcc00]" />
        </div>
        <h3 className="text-xl font-bold mb-2">Marketplace Coming Soon</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Buy compute resources from other users or monetize your idle capacity.
          Join the waitlist to be notified when we launch.
        </p>

        {/* Features Preview */}
        <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto mb-8">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <Cpu className="h-6 w-6 text-[#00ff88] mx-auto mb-2" />
            <h4 className="font-medium text-sm mb-1">Rent Compute</h4>
            <p className="text-xs text-muted-foreground">Scale your agents with on-demand resources</p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <DollarSign className="h-6 w-6 text-[#ffcc00] mx-auto mb-2" />
            <h4 className="font-medium text-sm mb-1">Earn Credits</h4>
            <p className="text-xs text-muted-foreground">Monetize your unused computing power</p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <TrendingUp className="h-6 w-6 text-[#bf5af2] mx-auto mb-2" />
            <h4 className="font-medium text-sm mb-1">Dynamic Pricing</h4>
            <p className="text-xs text-muted-foreground">Competitive rates based on demand</p>
          </div>
        </div>

        <Button className="bg-[#ffcc00] hover:bg-[#ffcc00]/90 text-[#05050a] font-semibold">
          Join Waitlist
          <ArrowUpRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
