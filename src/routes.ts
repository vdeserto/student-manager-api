import { Router } from 'express'

import StudentController from './controllers/StudentController'

const routes = Router()

routes.post('/alunos', StudentController.createStudent)
    .get('/alunos', StudentController.showAllStudents)
    .put('/alunos', (req, res) => res.status(405).json({Erro: 'método PUT /alunos não permitido!'}))
    .delete('/alunos', (req, res) => res.status(405).json({Erro: 'método DELETE /alunos não permitido!'}))

routes.get('/alunos/:id', StudentController.showStudentById)
    .post('/alunos/:id', (req, res) => res.status(405).json({Erro: 'método POST /alunos:id não permitido!'}))
    .put('/alunos/:id', StudentController.updateStudentById)
    .delete('/alunos/:id', StudentController.deleteStudentById)

export default routes