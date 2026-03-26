import * as crypto from 'crypto';

export function generateRequestHash(body: unknown) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(body))
    .digest('hex');
}