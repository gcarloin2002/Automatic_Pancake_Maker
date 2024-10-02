import crypto from 'crypto';

export function hashPassword(password: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return hash;
}

