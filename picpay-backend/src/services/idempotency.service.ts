import { IdempotencyRepository } from '../repositories/idempotency.repository';
import { AppError } from '../errors/AppError';

export class IdempotencyService {
  constructor(private repo: IdempotencyRepository) {}

  async handleRequest(
    key: string,
    requestHash: string
  ): Promise<{ shouldExecute: boolean; response?: any }> {
    const existing = await this.repo.findByKey(key);
    
    // mesma key com payload diferente
    if (existing && existing.requestHash !== requestHash) {
      console.log('Idempotency key already used with different payload');
      throw new AppError(
        'Idempotency key already used with different payload',
        400
      );
    }
    // ainda processando
    if (existing?.status === 'PENDING') {
      throw new AppError('Request is already being processed', 409);
    }

    // Já executou com sucesso
    if (existing?.status === 'SUCCESS') {
      return {
        shouldExecute: false,
        response: existing.response,
      };
    }

    // criar registro
    if (!existing) {
      await this.repo.create({
        key,
        status: 'PENDING',
        requestHash,
      });
    }

    return { shouldExecute: true };
  }

  async markSuccess(key: string, response: any) {
    await this.repo.update(key, {
      status: 'SUCCESS',
      response,
    });
  }

  async markFailed(key: string) {
    await this.repo.update(key, {
      status: 'FAILED',
    });
  }
}