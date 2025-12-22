import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit } from '../lib/rateLimit';
import { validateToken } from '../lib/token';
import { verifySignature } from '../lib/signature';

// Mock Database for Daily Check-ins (In-memory)
// In production, replace this with a real DB call (e.g., PostgreSQL, MongoDB, Redis)
const dailyCheckIns = new Set<string>();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- 1. IP + User-Agent Rate Limiting ---
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!checkRateLimit(ip, userAgent)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // --- 2. Token Validation ---
  const token = validateToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid client_token' });
  }

  // --- 3. Timestamp Validation (Anti-Replay) ---
  const { timestamp, sign } = req.body || {};
  
  if (!timestamp || !sign) {
    return res.status(400).json({ error: 'Missing timestamp or signature' });
  }

  const now = Date.now();
  const reqTime = Number(timestamp);
  
  // Allow max 60 seconds drift
  if (isNaN(reqTime) || Math.abs(now - reqTime) > 60000) {
    return res.status(403).json({ error: 'Request expired or invalid timestamp' });
  }

  // --- 4. Signature Verification (Anti-Tamper) ---
  const isValidSign = verifySignature(token, reqTime, sign);
  if (!isValidSign) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // --- 5. Daily Check-in Logic ---
  const today = new Date().toISOString().split('T')[0]; // Server Date: YYYY-MM-DD
  const checkInKey = `${token}:${today}`;

  if (dailyCheckIns.has(checkInKey)) {
    // Already checked in
    return res.status(200).json({ 
      success: true, 
      status: 'already_checked_in',
      date: today,
      message: 'You have already checked in today.'
    });
  }

  // Perform Check-in
  dailyCheckIns.add(checkInKey);

  // Clean up old keys (Optional rudimentary memory management for this mock DB)
  // In a real DB, you'd just query by date column
  if (dailyCheckIns.size > 10000) {
    dailyCheckIns.clear();
    dailyCheckIns.add(checkInKey);
  }

  return res.status(200).json({
    success: true,
    status: 'checked_in',
    date: today,
    message: 'Check-in successful!'
  });
}