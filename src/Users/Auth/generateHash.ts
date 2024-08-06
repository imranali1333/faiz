import crypto from 'crypto';
import { BOT_TOKEN } from './config'; // Import BOT_TOKEN from your config

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be defined in the environment variables');
}

export function generateHash(authData: Record<string, string | undefined>): string {
    // Filter out undefined values and convert to key=value pairs
    const dataToHash = Object.entries(authData)
      .filter(([key, value]) => value !== undefined && value !== '') // Filter out undefined or empty values
      .map(([key, value]) => `${key}=${value}`) // Convert to key=value pairs
      .sort() // Sort the entries
      .join('\n'); // Join with new lines
  
    // Generate the secret key from BOT_TOKEN
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  
    // Generate the HMAC hash
    return crypto.createHmac('sha256', secretKey).update(dataToHash).digest('hex');
  }