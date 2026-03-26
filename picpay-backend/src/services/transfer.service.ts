import { findUserById, updateUserBalance } from '../repositories/user.repository'

interface TransferInput {
  value: number
  payer: number
  payee: number
}


export class TransferService {
  async execute(data: TransferInput) {

    // 1. Buscar usuários
    const payer = await findUserById(data.payer)
    const payee = await findUserById(data.payee)

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

    // 4. Calcular novos saldos
    const newPayerBalance = payerBalance - data.value
    const newPayeeBalance = Number(payee.balance) + data.value

    // 5. Atualizar banco
    await updateUserBalance(payer.id, newPayerBalance.toString())
    await updateUserBalance(payee.id, newPayeeBalance.toString())

    return {
      message: 'Transferência realizada com sucesso'
    }
  }
}