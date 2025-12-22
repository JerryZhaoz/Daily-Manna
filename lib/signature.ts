import crypto from 'crypto';
import { Buffer } from 'buffer';

const SERVER_SECRET = process.env.SERVER_SECRET || 'default-secret-change-me-in-prod';

export function verifySignature(token: string, timestamp: number, sign: string): boolean {
  try {
    // 1. Reconstruct the payload string exactly as frontend did
    // Payload = token + timestamp (string concatenation)
    const payload = `${token}${timestamp}`;

    // 2. Calculate HMAC
    const expectedSign = crypto
      .createHmac('sha256', SERVER_SECRET)
      .update(payload)
      .digest('hex');

    // 3. Constant-time comparison to prevent timing attacks
    const signBuffer = Buffer.from(sign);
    const expectedBuffer = Buffer.from(expectedSign);

    if (signBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signBuffer, expectedBuffer);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}