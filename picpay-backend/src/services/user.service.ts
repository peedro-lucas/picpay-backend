import { createUser as createUserRepository, findUserByEmail, getAllUsers } from '../repositories/user.repository'

type UserType = 'common' | 'merchant'

interface CreateUserInput {
  name: string
  email: string
  balance?: string
  type: UserType
}

export class UserService {
  async createUser(data: CreateUserInput) {
    // Validar tipo
    const validTypes = ['common', 'merchant']
    if (!validTypes.includes(data.type)) {
      throw new AppError(`Tipo inválido. Use: ${validTypes.join(' ou ')}`, 400)
    }
    console.log("Chegou aqui 1");
    // Validar email (verifica se já existe)
    const existingUser = await findUserByEmail(data.email)
    console.log(existingUser);
    if (existingUser) {
      throw new AppError('Email já cadastrado', 409)
    }

    // Validar email formato básico (depois melhora)
    if (!data.email.includes('@')) {
      throw new AppError('Email inválido', 400)
    }
    // Chamar repository
    const newUser = await createUserRepository({
      name: data.name,
      email: data.email,
      balance: data.balance,
      type: data.type as 'common' | 'merchant',
    })

    return newUser
  }

  async listUsers() {
    const result = await getAllUsers()

    return result
  }
}
