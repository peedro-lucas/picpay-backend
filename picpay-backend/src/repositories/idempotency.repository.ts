import { db } from '../db';
import { idempotencyKeys } from '../db/schemas/idempotency.schema';
import { eq } from 'drizzle-orm';

export class IdempotencyRepository {
  async findByKey(key: string) {
    const result = await db
      .select()
      .from(idempotencyKeys)
      .where(eq(idempotencyKeys.key, key));

    return result[0];
  }

  async create(data: {
    key: string;
    status: string;
    requestHash: string;
  }) {
    return db.insert(idempotencyKeys).values(data);
  }

  async update(
    key: string,
    data: {
      status?: string;
      response?: unknown;
    }
  ) {
    return db
      .update(idempotencyKeys)
      .set(data)
      .where(eq(idempotencyKeys.key, key));
  }
}