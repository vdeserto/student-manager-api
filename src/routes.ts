import { Router } from 'express'

import StudentController from './controllers/StudentController'

const routes = Router()

routes.post('/alunos', (req, res) => StudentController.createStudent(req, res))
    .get('/alunos', StudentController.showAllStudents)
    .put('/alunos', (req, res) => res.status(405).json({Erro: 'método PUT /alunos não permitido!'}))
    .delete('/alunos', (req, res) => res.status(405).json({Erro: 'método DELETE /alunos não permitido!'}))

routes.get('/alunos/:id', StudentController.showStudentById)
    .post('/alunos/:id', (req, res) => res.status(405).json({Erro: 'método POST /alunos:id não permitido!'}))
    .put('/alunos/:id', (req, res) =>StudentController.updateStudentById(req, res))
    .delete('/alunos/:id', (req, res) => StudentController.deleteStudentById(req, res))

export default routes