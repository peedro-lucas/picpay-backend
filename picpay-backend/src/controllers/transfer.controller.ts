import { Context } from 'hono'
import { TransferService } from '../services/transfer.service'

const transferService = new TransferService()

export async function transferController(c: Context) {
  try {
    const body = await c.req.json()

    const result = await transferService.execute({
      value: body.value,
      payer: body.payer,
      payee: body.payee,
    })

    return c.json(result)
  } catch (error: any) {
    if (error.status) {
      return c.json({ error: error.message }, error.status)
    }

    return c.json({ error: 'Erro na transferência' }, 500)
  }
}