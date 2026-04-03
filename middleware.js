/**
 * middleware.js — Edge middleware for bot protection
 * ─────────────────────────────────────────────────────────────────
 * Blocks AI training bots and content scrapers at the edge.
 * robots.txt is advisory — this is enforced.
 *
 * Allowed: Googlebot, Bingbot, social media previews, human users.
 * Blocked: GPTBot, CCBot, Bytespider, scrapers, AI training bots.
 */

import { NextResponse } from 'next/server';

// Bots to BLOCK — AI training, scraping, harvesting
const BLOCKED_BOTS = [
  'gptbot', 'chatgpt-user', 'google-extended', 'claude-web', 'anthropic-ai',
  'ccbot', 'bytespider', 'amazonbot', 'ahrefsbot', 'semrushbot', 'mj12bot',
  'dotbot', 'blexbot', 'dataforseobot', 'petalbot', 'megaindex', 'sogou',
  'yandexbot', 'baiduspider', 'diffbot', 'perplexitybot', 'cohere-ai',
  'youbot', 'meta-externalagent', 'ai2bot', 'applebot-extended', 'omgili',
  'scrapy', 'python-requests', 'go-http-client', 'java/', 'wget', 'curl/',
  'httrack', 'harvest', 'collector', 'extractor',
];

// Bots to ALLOW — search engines + social media previews
const ALLOWED_BOTS = [
  'googlebot', 'bingbot', 'facebookexternalhit', 'twitterbot',
  'whatsapp', 'linkedinbot', 'slackbot', 'telegrambot',
  'applebot', 'duckduckbot',
];

export function middleware(request) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  // Allow if no user-agent (rare but possible)
  if (!ua) return NextResponse.next();

  // Check if it's an allowed bot first
  for (const bot of ALLOWED_BOTS) {
    if (ua.includes(bot)) return NextResponse.next();
  }

  // Block known bad bots
  for (const bot of BLOCKED_BOTS) {
    if (ua.includes(bot)) {
      return new NextResponse('Access denied', { status: 403 });
    }
  }

  // Everyone else (human users) — allow
  return NextResponse.next();
}

// Only run middleware on page routes and API routes that serve content
// Skip: static files, images, fonts, _next assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|fonts|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)',
  ],
};
