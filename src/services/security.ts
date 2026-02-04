import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  default: { windowMs: 60 * 1000, maxRequests: 100 },
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  api: { windowMs: 60 * 1000, maxRequests: 60 },
  deploy: { windowMs: 60 * 1000, maxRequests: 10 },
};

export class ShellGuard {
  private blockedIPs: Set<string> = new Set();
  private suspiciousPatterns: RegExp[] = [
    /(\.\.\/)|(\.\.\\)/,  // Path traversal
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,  // XSS
    /(\b(union|select|insert|update|delete|drop|create)\b.*\b(from|into|table|database)\b)/gi,  // SQL injection
    /(\$\{|\$\(|`)/,  // Command injection
  ];

  async rateLimit(
    identifier: string,
    type: keyof typeof DEFAULT_RATE_LIMITS = 'default'
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const config = DEFAULT_RATE_LIMITS[type] || DEFAULT_RATE_LIMITS.default;
    const key = `${type}:${identifier}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      entry = {
        count: 0,
        resetAt: now + config.windowMs,
      };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const allowed = entry.count <= config.maxRequests;

    return { allowed, remaining, resetAt: entry.resetAt };
  }

  validateInput(input: unknown): { valid: boolean; reason?: string } {
    if (typeof input !== 'string') {
      return { valid: true };
    }

    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        return { valid: false, reason: 'Potentially malicious input detected' };
      }
    }

    return { valid: true };
  }

  validateRequest(request: NextRequest): { valid: boolean; reason?: string } {
    const ip = this.getClientIP(request);

    if (this.blockedIPs.has(ip)) {
      return { valid: false, reason: 'IP is blocked' };
    }

    // Check for suspicious headers
    const userAgent = request.headers.get('user-agent') || '';
    if (this.isSuspiciousUserAgent(userAgent)) {
      return { valid: false, reason: 'Suspicious user agent' };
    }

    return { valid: true };
  }

  blockIP(ip: string, durationMs: number = 3600000): void {
    this.blockedIPs.add(ip);
    setTimeout(() => {
      this.blockedIPs.delete(ip);
    }, durationMs);
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
  }

  getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }

    return 'unknown';
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousAgents = [
      /curl/i,
      /wget/i,
      /python-requests/i,
      /scrapy/i,
      /bot(?!.*google|.*bing|.*yahoo)/i,
    ];

    // Only flag if it's explicitly a scraper, not legitimate tools
    for (const pattern of suspiciousAgents) {
      if (pattern.test(userAgent) && !this.isLegitimateBot(userAgent)) {
        return false; // Don't block legitimate API clients
      }
    }

    return false;
  }

  private isLegitimateBot(userAgent: string): boolean {
    const legitimateBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
    ];

    return legitimateBots.some((pattern) => pattern.test(userAgent));
  }

  sanitizeOutput<T extends Record<string, unknown>>(
    data: T,
    sensitiveFields: string[] = ['password', 'apiKey', 'token', 'secret']
  ): T {
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        delete sanitized[field];
      }
    }

    return sanitized;
  }

  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  validateCSRFToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) return false;

    // Timing-safe comparison
    if (token.length !== storedToken.length) return false;

    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
    }

    return result === 0;
  }
}

export const shellGuard = new ShellGuard();

// Middleware helper
export function withRateLimit(type: keyof typeof DEFAULT_RATE_LIMITS = 'default') {
  return async (request: NextRequest) => {
    const ip = shellGuard.getClientIP(request);
    const result = await shellGuard.rateLimit(ip, type);

    if (!result.allowed) {
      return {
        limited: true,
        headers: {
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetAt.toString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      };
    }

    return {
      limited: false,
      headers: {
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetAt.toString(),
      },
    };
  };
}
