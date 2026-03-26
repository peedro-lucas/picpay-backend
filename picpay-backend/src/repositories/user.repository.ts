import { db } from '../db'
import { users } from '../db/schemas/user.schema'
import { eq } from 'drizzle-orm'

interface CreateUserInput {
  name: string
  email: string
  balance?: string
  type: 'common' | 'merchant'
}

export async function createUser(data: CreateUserInput) {
  const result = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      balance: data.balance || '0',
      type: data.type,
    })
    .returning()

  if (!result[0]) {throw new Error('Erro ao criar usuário')}

  return result[0]
}

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  
  
  return result[0]
}

export async function getAllUsers(){
    const result = await db.select().from(users)
    
    return result
}

// buscar por id
export async function findUserById(id: number) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  return result[0]
}

// atualizar saldo
export async function updateUserBalance(id: number, balance: string) {
  await db
    .update(users)
    .set({ balance })
    .where(eq(users.id, id))
}
