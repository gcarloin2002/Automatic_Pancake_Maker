import crypto from 'crypto';


// Takes in password and salt (let salt value be the username)
export function hashPassword(password: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return hash;
}

