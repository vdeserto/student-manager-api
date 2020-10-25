import { Router } from 'express'

import StudentController from './controllers/StudentController'

const routes = Router()

routes.post('/alunos', StudentController.create)

routes.get('/alunos', StudentController.index)


export default routes