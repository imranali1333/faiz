import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || '';

export interface AuthData {
  id: string;
  telegramId: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
  phone_number?: string;
  language_code?: string;
  is_bot?: boolean;
}

export interface Hashing {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  phone_number: string;
  telegramId: string;
}

export function checkTelegramAuthorization(authData: AuthData): AuthData {
  const checkHash = authData.hash;
  const dataCheckArr: string[] = [];

  for (const key in authData) {
    if (key !== 'hash' && authData[key as keyof AuthData] !== undefined) {
      dataCheckArr.push(`${key}=${authData[key as keyof AuthData]}`);
    }
  }
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
  if (hash !== checkHash) {
    throw new Error('Data is NOT from Telegram');
  }
  if ((Date.now() / 1000) - parseInt(authData.auth_date) > 86400) {
    throw new Error('Data is outdated');
  }
  return authData;
}

function generateAuthData(): AuthData {
  return {
    id: '123456',
    telegramId: '123456789',
    first_name: 'imranali',
    last_name: '44444hfwhf',
    username: '@aaliiajaii.dev',
    photo_url: 'http://example.com/photo.jpg',
    phone_number: "03056151224",
    auth_date: Math.floor(Date.now() / 1000).toString(),
    hash: '',
  };
}

function generateHash(authData: AuthData): string {
  const dataCheckArr: string[] = [];
  for (const key in authData) {
    if (authData[key as keyof AuthData] !== undefined && key !== 'hash') {
      dataCheckArr.push(`${key}=${authData[key as keyof AuthData]}`);
    }
  }
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  return crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
}

function generateAuthUrl(authData: AuthData): string {
  authData.hash = generateHash(authData); // Set the hash value
  const params = new URLSearchParams({
    ...authData,
    hash: authData.hash
  } as any).toString();
  return `http://localhost:8080/api/auth?${params}`;
}

const authData = generateAuthData();
authData.hash = generateHash(authData); // Set the hash value
const url = generateAuthUrl(authData);

console.log('Generated URL for Test:', url);