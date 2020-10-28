import { Request, Response } from 'express'
import moment from 'moment'
import { getRepository } from 'typeorm'


import Student from '../models/Student'
import studentView from '../views/student_view'

export default {
    async showAllStudents (req: Request, res: Response) {
        const studentRepository = getRepository(Student)
        const students = await studentRepository.find()
        
        return res.json(studentView.renderMany(students))
        
    },

    async createStudent(req: Request, res: Response) {
        const {
            nome,
            rga,
            curso,            
        } = req.body      
        
        const studentsRepository = getRepository(Student)        
        
        const data = {
            nome,
            rga,
            curso,
        }    
        
        // const schema = Yup.object().shape({
            //     name: Yup.string().required(),
            //     latitude: Yup.number().required(),
            //     longitude: Yup.number().required(),
            //     about: Yup.string().required().max(300),
            //     instructions: Yup.string().required(),
            //     opening_hours: Yup.string().required(),
            //     open_on_weekends: Yup.boolean().required(),   
        //     images: Yup.array(
            //         Yup.object().shape({
                //             path: Yup.string().required()
                //         })
                //     )
                // })
                
                // await schema.validate(data, {
                    //     abortEarly: false
                    // })
                    
        const student = studentsRepository.create(data)
        
        await studentsRepository.save(student)
        return res.json(studentView.render(student)) // RETURN 201 -> CREATED (SEMANTICO)
    },
    
    async showStudentById (req: Request, res: Response){
        const {id} = req.params

        const studentRepository = getRepository(Student)
        
        const student = await studentRepository.findOne({id: Number.parseInt(id)}).catch(e => console.error(e.errors))    

        if(student === undefined) return res.status(400).json({Erro: 'Estudante não encontrado'})

        return res.status(200).json(studentView.render(student))
    },

    async updateStudentById (req: Request, res: Response) {
        const {id} = req.params

        const { nome, 
                rga,
                curso,
                registrado_em,
                situacao} = req.body

        if(!nome && !rga && !curso)    
            return res.status(404).json('Nenhum dado foi informado')

        const studentRepository = getRepository(Student)
            
        nome && await studentRepository.update(Number.parseInt(id), {nome: nome} )
        rga && await studentRepository.update(Number.parseInt(id), {rga: rga})
        curso && await studentRepository.update(Number.parseInt(id), {curso: curso} )
        registrado_em && await studentRepository.update(Number.parseInt(id), {registrado_em: moment(registrado_em).format('YYYY-DD-MM HH:mm:ss')})
       if(situacao == 'ativo' || situacao == 'inativo') await studentRepository.update(Number.parseInt(id), {situacao: situacao.toString().toLowerCase() === 'ativo' ? true : (situacao.toString().toLowerCase() === 'inativo' && false)})

        const student = await studentRepository.findOne({id: Number.parseInt(id)}).catch(e => console.error(e.errors))     
        
        if(!student) return res.status(404).json({Erro:'Nenhum estudante foi encontrado'})
        
        return res.status(200).json(studentView.render(student))
    },

    async deleteStudentById (req: Request, res: Response){
        const { id } = req.params
        
        const studentRepository = getRepository(Student)

        // const encontrado = studentRepository.findOne(Number.parseInt(id))

        const deletado = await studentRepository.softDelete({id: Number.parseInt(id)}).catch((e) => res.status(404).json('e.errors' + e ))
        
        // const student = await studentRepository.restore(deletado)

        // if(!student) return res.status(404).json('Not Found student')

        return res.status(200).json(deletado)

    }
}
