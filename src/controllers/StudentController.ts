import { Request, Response } from 'express'
import { getRepository } from 'typeorm'


import Student from '../models/Student'
import studentView from '../views/student_view'

export default {
    async index (req: Request, res: Response) {
        console.log('index')
        const studentRepository = getRepository(Student)
        const students = await studentRepository.find()
        return res.json(students)
        
        // console.log(studentRepository)
        // console.log(studentRepository)


        // return res.json(studentView.renderMany(students))
    },

    async create(req: Request, res: Response) {

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
        return res.status(201).json(studentView.render(student))
        
        // return res.status(201).json(student) // RETURN 201 -> CREATED (SEMANTICO)
    }
}
