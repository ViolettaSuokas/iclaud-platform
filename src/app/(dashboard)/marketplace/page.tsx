import {
  Search,
  Star,
  Download,
  ArrowUpRight,
  Sparkles,
  Code,
  FileText,
  MessageSquare,
  Database,
  Globe,
  Zap,
  Shield,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Agent templates data
const featuredAgents = [
  {
    id: 'gpt-coder',
    name: 'GPT-4 Code Assistant',
    description: 'AI pair programmer that writes, reviews, and explains code in any language',
    author: 'iClaud',
    authorVerified: true,
    stars: 2847,
    downloads: 12500,
    price: 0,
    runtime: 'python',
    category: 'Development',
    tags: ['coding', 'gpt-4', 'productivity'],
    gradient: 'from-[#00ff88] to-[#00d4ff]',
  },
  {
    id: 'web-scraper-pro',
    name: 'Web Scraper Pro',
    description: 'Intelligent web scraping with anti-bot bypass and structured data extraction',
    author: 'DataTools',
    authorVerified: true,
    stars: 1923,
    downloads: 8400,
    price: 4.99,
    runtime: 'python',
    category: 'Data',
    tags: ['scraping', 'data', 'automation'],
    gradient: 'from-[#bf5af2] to-[#ff375f]',
  },
  {
    id: 'support-bot',
    name: 'Customer Support Agent',
    description: '24/7 AI support agent with memory, escalation, and multi-language support',
    author: 'iClaud',
    authorVerified: true,
    stars: 1567,
    downloads: 6200,
    price: 0,
    runtime: 'nodejs',
    category: 'Communication',
    tags: ['support', 'chat', 'multilingual'],
    gradient: 'from-[#ffcc00] to-[#ff9500]',
  },
];

const categories = [
  { id: 'all', name: 'All', icon: Sparkles, count: 156 },
  { id: 'productivity', name: 'Productivity', icon: Zap, count: 42 },
  { id: 'development', name: 'Development', icon: Code, count: 38 },
  { id: 'data', name: 'Data & Analytics', icon: Database, count: 28 },
  { id: 'communication', name: 'Communication', icon: MessageSquare, count: 24 },
  { id: 'content', name: 'Content', icon: FileText, count: 18 },
];

const integrations = [
  { id: 'slack', name: 'Slack', icon: '💬', connected: true, color: '#4a154b' },
  { id: 'discord', name: 'Discord', icon: '🎮', connected: true, color: '#5865f2' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', connected: false, color: '#0088cc' },
  { id: 'github', name: 'GitHub', icon: '🐙', connected: true, color: '#333' },
  { id: 'notion', name: 'Notion', icon: '📝', connected: false, color: '#000' },
  { id: 'gmail', name: 'Gmail', icon: '📧', connected: false, color: '#ea4335' },
  { id: 'sheets', name: 'Sheets', icon: '📊', connected: false, color: '#34a853' },
  { id: 'openai', name: 'OpenAI', icon: '🤖', connected: true, color: '#10a37f' },
];

const recentlyAdded = [
  { id: 'sentiment', name: 'Sentiment Analyzer', author: 'MLLabs', stars: 234, price: 0 },
  { id: 'translator', name: 'Real-time Translator', author: 'LangAI', stars: 189, price: 2.99 },
  { id: 'summarizer', name: 'Document Summarizer', author: 'iClaud', stars: 456, price: 0 },
  { id: 'classifier', name: 'Image Classifier', author: 'VisionAI', stars: 312, price: 9.99 },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Marketplace
            <span className="px-2 py-0.5 text-xs font-medium bg-[#ffcc00]/20 text-[#ffcc00] rounded-full">
              Beta
            </span>
          </h2>
          <p className="text-muted-foreground">
            Discover and deploy AI agents, templates, and integrations
          </p>
        </div>
        <Button variant="outline" className="border-white/10">
          <TrendingUp className="h-4 w-4 mr-2" />
          Submit Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search agents, templates, integrations..."
          className="w-full h-12 pl-12 pr-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/20 transition-all"
        />
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = index === 0;
          return (
            <button
              key={cat.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]'
                  : 'bg-white/[0.02] border border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/[0.1]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{cat.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${isActive ? 'bg-[#00ff88]/20' : 'bg-white/[0.05]'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Agents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-[#ffcc00]" />
            Featured Agents
          </h3>
          <Link href="#" className="text-sm text-muted-foreground hover:text-[#00ff88] flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredAgents.map((agent) => (
            <div
              key={agent.id}
              className="crypto-card rounded-lg overflow-hidden hover:border-white/[0.1] transition-all group"
            >
              {/* Gradient header */}
              <div className={`h-2 bg-gradient-to-r ${agent.gradient}`} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-[#00ff88] transition-colors">
                        {agent.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{agent.author}</span>
                        {agent.authorVerified && (
                          <CheckCircle className="h-3 w-3 text-[#00d4ff]" />
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${agent.price === 0 ? 'text-[#00ff88]' : 'text-foreground'}`}>
                    {agent.price === 0 ? 'Free' : `$${agent.price}/mo`}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {agent.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium bg-white/[0.05] rounded text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-[#ffcc00]" />
                      {agent.stars.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {(agent.downloads / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#05050a] font-semibold"
                  >
                    Deploy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#00d4ff]" />
            Integrations
          </h3>
          <Link href="#" className="text-sm text-muted-foreground hover:text-[#00ff88] flex items-center gap-1">
            Manage <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {integrations.map((int) => (
            <button
              key={int.id}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                int.connected
                  ? 'bg-white/[0.02] border-[#00ff88]/30 hover:border-[#00ff88]/50'
                  : 'bg-white/[0.01] border-white/[0.06] opacity-60 hover:opacity-100'
              }`}
            >
              <span className="text-2xl">{int.icon}</span>
              <span className="text-xs text-muted-foreground">{int.name}</span>
              {int.connected && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_6px_rgba(0,255,136,0.6)]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Two columns: Recently Added + Coming Soon */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recently Added */}
        <section className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#bf5af2]" />
            Recently Added
          </h3>
          <div className="space-y-3">
            {recentlyAdded.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 rounded-md bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-white/[0.05] flex items-center justify-center">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">by {agent.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-[#ffcc00]" />
                    {agent.stars}
                  </span>
                  <span className={`text-xs font-medium ${agent.price === 0 ? 'text-[#00ff88]' : ''}`}>
                    {agent.price === 0 ? 'Free' : `$${agent.price}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon Features */}
        <section className="crypto-card rounded-lg p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#ffcc00]" />
            Coming Soon
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-md bg-[#00ff88]/5 border border-[#00ff88]/20">
              <div className="h-8 w-8 rounded-md bg-[#00ff88]/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#00ff88]">Sell Your Agents</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monetize your custom agents and earn credits from every deployment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-[#bf5af2]/5 border border-[#bf5af2]/20">
              <div className="h-8 w-8 rounded-md bg-[#bf5af2]/10 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-[#bf5af2]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#bf5af2]">Verified Publishers</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Security-audited agents from trusted developers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-[#00d4ff]/5 border border-[#00d4ff]/20">
              <div className="h-8 w-8 rounded-md bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-[#00d4ff]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#00d4ff]">One-Click Deploy</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Deploy any marketplace agent to your cloud instantly
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-[#ffcc00] hover:bg-[#ffcc00]/90 text-[#05050a] font-semibold"
          >
            Join Waitlist
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </section>
      </div>
    </div>
  );
}
