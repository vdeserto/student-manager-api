import { Request, Response } from 'express'
import moment from 'moment'
import { Between, getRepository, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual } from 'typeorm'


import Student from '../models/Student'
import studentView from '../views/student_view'

export default {
    /**
     * Método GET em /alunos
     * Listagem de todos os atributos de um estudante, definidos na model Student
     * opcionalmente tomando como critério: limite[default=25], pagina[default=1] e nome
     * Leitura da tabela students respeitando regras da model Student
    **/
    async showAllStudents (req: Request, res: Response) {

        // Desestruturação das query params
        let {
            limite,
            pagina,
            nome
        } = req.query
        
        
        // Valores padrões estabelecidos: limite=25, pagina=1
        limite === undefined ? limite = '25' : limite
        pagina === undefined ? pagina = '1' : pagina
        nome === undefined ? nome = '' : nome
        
        /* Lógica do limite inferior: (limite * pagina) - (limite + 1) 
        *  Exemplo: para limite=50 e pagina=2 temos: (50 * 2) - (50 - 1 ) = 100 - 49 = 51,
        *           ou seja, iniciar projeção de estudantes a partir do 51º registro
        */
        let inicio = ( Number.parseInt( limite.toString() ) * Number.parseInt( pagina.toString() )  ) - Number.parseInt( limite.toString() ) + 1

        /* Lógica do limite superior: limite * pagina
        *  Exemplo: para limite=50 e pagina=2 temos: 50 * 2  = 100,
        *           ou seja, encerrar a projeção de estudantes no 100º registro
        */
        let fim = Number.parseInt(limite.toString()) * Number.parseInt( pagina.toString() )
        
        const studentRepository = getRepository(Student)

        /* Lógica da projeção dos estudantes usando TypeORM
        *    SELECT *
            FROM students
            WHERE id BETWEEN inicio AND fim AND nome="%nome%"
        */
        const students = await studentRepository.find(
            {where:
                {id: Between(inicio, fim),
                nome: Like(`%${nome}%`)
                }
            })
        
        return res.json(studentView.renderMany(students))
        
    },

    /**
     * Método POST em /alunos
     * Criação de um estudante, recebendo nome, rga e curso
     * Inserção na tabela students respeitando regras da model Student
     * 
    **/
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

        const deletedStudent = await this.showStudentById(req, res)

        await studentRepository.delete({id: Number.parseInt(id)}).catch((e) => res.status(404).json('e.errors' + e ))
        
        // const student = await studentRepository.restore(deletado)

        // if(!student) return res.status(404).json('Not Found student')

        return deletedStudent

    }
}
