import { Hono } from 'hono'
import { createUserController, listUsersController } from './controllers/user.controller'
import { transferController } from './controllers/transfer.controller'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'API rodando' })
})

app.post('/users', createUserController)
app.get('/users', listUsersController)
app.post('/transfer', transferController)

export default app