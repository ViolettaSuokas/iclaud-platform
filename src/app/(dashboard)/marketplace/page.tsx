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

// Brand icons
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const SlackIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const DiscordIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
  </svg>
);

const TelegramIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const GitHubIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const NotionIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.094-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
  </svg>
);

const GmailIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const SheetsIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M19.385 2H4.615A2.615 2.615 0 0 0 2 4.615v14.77A2.615 2.615 0 0 0 4.615 22h14.77A2.615 2.615 0 0 0 22 19.385V4.615A2.615 2.615 0 0 0 19.385 2zM8.462 17.846H5.538v-2.923h2.924v2.923zm0-4.308H5.538v-2.923h2.924v2.923zm0-4.307H5.538V6.308h2.924v2.923zm5.076 8.615h-2.923v-2.923h2.923v2.923zm0-4.308h-2.923v-2.923h2.923v2.923zm0-4.307h-2.923V6.308h2.923v2.923zm4.924 8.615h-2.924v-2.923h2.924v2.923zm0-4.308h-2.924v-2.923h2.924v2.923zm0-4.307h-2.924V6.308h2.924v2.923z"/>
  </svg>
);

const OpenAIIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

interface Integration {
  id: string;
  name: string;
  icon: React.ComponentType<IconProps>;
  connected: boolean;
  color: string;
}

const integrations: Integration[] = [
  { id: 'slack', name: 'Slack', icon: SlackIcon, connected: true, color: '#4a154b' },
  { id: 'discord', name: 'Discord', icon: DiscordIcon, connected: true, color: '#5865f2' },
  { id: 'telegram', name: 'Telegram', icon: TelegramIcon, connected: false, color: '#0088cc' },
  { id: 'github', name: 'GitHub', icon: GitHubIcon, connected: true, color: '#ffffff' },
  { id: 'notion', name: 'Notion', icon: NotionIcon, connected: false, color: '#ffffff' },
  { id: 'gmail', name: 'Gmail', icon: GmailIcon, connected: false, color: '#ea4335' },
  { id: 'sheets', name: 'Sheets', icon: SheetsIcon, connected: false, color: '#34a853' },
  { id: 'openai', name: 'OpenAI', icon: OpenAIIcon, connected: true, color: '#10a37f' },
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
          {integrations.map((int) => {
            const Icon = int.icon;
            return (
              <button
                key={int.id}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  int.connected
                    ? 'bg-white/[0.02] border-[#00ff88]/30 hover:border-[#00ff88]/50'
                    : 'bg-white/[0.01] border-white/[0.06] opacity-60 hover:opacity-100'
                }`}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: int.connected ? int.color : undefined }}
                />
                <span className="text-xs text-muted-foreground">{int.name}</span>
                {int.connected && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_6px_rgba(0,255,136,0.6)]" />
                )}
              </button>
            );
          })}
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
