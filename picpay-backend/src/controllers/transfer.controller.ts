import { Context } from 'hono'
import { TransferService } from '../services/transfer.service'
import { IdempotencyService } from '../services/idempotency.service'
import { IdempotencyRepository } from '../repositories/idempotency.repository'

import { generateRequestHash } from '../utils/hash'
import { AppError } from '../errors/AppError'
import { ContentfulStatusCode } from 'hono/utils/http-status'

const transferService = new TransferService()
const idempotencyService = new IdempotencyService(
  new IdempotencyRepository()
)

export async function transferController(c: Context) {
  try {
    const body = await c.req.json()

    const idempotencyKey = c.req.header('Idempotency-Key')

    if (!idempotencyKey) {
      throw new AppError('Idempotency-Key is required', 400)
    }

    const requestHash = generateRequestHash(body)

    const { shouldExecute, response } =
      await idempotencyService.handleRequest(
        idempotencyKey,
        requestHash
      )
      console.log('shouldExecute', shouldExecute);
    if (!shouldExecute) {
      return c.json(response)
    }


    const result = await transferService.execute({
      value: body.value,
      payer: body.payer,
      payee: body.payee,
    })

    await idempotencyService.markSuccess(idempotencyKey, result)

    return c.json(result)

  } catch (error: any) {

    
    const idempotencyKey = c.req.header('Idempotency-Key')
    if (idempotencyKey) {
      await idempotencyService.markFailed(idempotencyKey)
    }

    if (error instanceof AppError) {
      return c.json({ error: error.message }, error.status as ContentfulStatusCode)
    }

    return c.json({ error: 'Erro na transferência' }, 500)
  }
}