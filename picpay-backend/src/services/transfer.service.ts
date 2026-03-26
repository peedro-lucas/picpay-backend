import { db } from '../db'
import { eq } from 'drizzle-orm'
import { users } from '../db/schemas/user.schema'
import { findUserById } from '../repositories/user.repository'
import { authorizeTransaction } from '../integrations/authorizer'
import { sendNotification } from '../integrations/notification'
import { AppError } from '../errors/AppError'

interface TransferInput {
  value: number
  payer: number
  payee: number
}

export class TransferService {
  async execute(data: TransferInput) {

        return await db.transaction(async (tx) => {

        // 🔒 BUSCAR COM LOCK
        const payerResult = await tx
        .select()
        .from(users)
        .where(eq(users.id, data.payer))
        .for('update')

        const payeeResult = await tx
        .select()
        .from(users)
        .where(eq(users.id, data.payee))
        .for('update')

      const payer = payerResult[0]
      const payee = payeeResult[0]

      if (!payer || !payee) {
        throw new AppError('Usuário não encontrado', 404)
      }

      // 2. Validar tipo
      if (payer.type === 'merchant') {
        throw new AppError('Lojista não pode enviar dinheiro', 403)
      }

      // 3. Validar saldo
      const payerBalance = Number(payer.balance)

      if (payerBalance < data.value) {
        throw new AppError('Saldo insuficiente', 400)
      }

      const isAuthorized = await authorizeTransaction()

      if (!isAuthorized) {
        throw new AppError('Transação não autorizada', 403)
      }

      // 4. Calcular novos saldos
      const newPayerBalance = payerBalance - Number(data.value)
      const newPayeeBalance = Number(payee.balance) + Number(data.value)

      // 5. Atualizar banco usando TX (🔥 importante)
      await tx
        .update(users)
        .set({ balance: newPayerBalance.toString() })
        .where(eq(users.id, payer.id))

      // TESTE DE ERRO FORÇADO (coloca aqui)
      //throw new Error('FORÇANDO ERRO NO MEIO')

      await tx
        .update(users)
        .set({ balance: newPayeeBalance.toString() })
        .where(eq(users.id, payee.id))

        const notified = await sendNotification()

        if (!notified) {
          console.log('⚠️ Falha ao enviar notificação')
        }

      return {
        message: 'Transferência realizada com sucesso'
      }
    })
  }
}