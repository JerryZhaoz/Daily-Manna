interface RateLimitRecord {
  count: number;
  startTime: number;
}

// In-memory store. 
// NOTE: In a serverless environment (Vercel), this memory is ephemeral and resets 
// when the function cold-boots. For strict production limits, use Vercel KV or Redis.
const rateLimitMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string, userAgent: string): boolean {
  const key = `${ip}|${userAgent}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return true;
  }

  // Check if window has passed
  if (now - record.startTime > WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return true;
  }

  // Check count
  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  // Increment
  record.count += 1;
  return true;
}