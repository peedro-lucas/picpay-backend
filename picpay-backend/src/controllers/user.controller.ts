import { Context } from 'hono'
import { UserService } from '../services/user.service'

const userService = new UserService()

export async function createUserController(c: Context) {
  try {
    // Pega body
    const body = await c.req.json()
    
    // Valida dados obrigatórios
    if (!body.name || !body.email || !body.type) {
      return c.json(
        {
          error: 'Nome, email e tipo são obrigatórios'
        },
        400
      )
    }
    
    // Chama service
    const newUser = await userService.createUser({
      name: body.name,
      email: body.email,
      balance: body.balance,
      type: body.type,
    })
    // Retorna resposta
    return c.json(
      {
        message: 'Usuário criado com sucesso',
        data: newUser,
      },
      201
    )
  } catch (error: any) {
    // Se vier erro do service com status
    if (error.status) {
      return c.json({ error: error.message }, error.status)
    }

    // Erro genérico
    return c.json({ error: 'Erro ao criar usuário' }, 500)
  }
}

export async function listUsersController(c: Context) {
  try {
    const users = await userService.listUsers()

    return c.json({
      data: users,
    })
  } catch (error) {
    return c.json({ error: 'Erro ao listar usuários' }, 500)
  }
}
