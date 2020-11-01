import { Request, Response } from 'express'
import moment from 'moment'
import {  getRepository, Like } from 'typeorm'


import Student from '../models/Student'
import studentView from '../views/student_view'

var _errors: string[] = []

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
        limite = limite === undefined ? '25' : limite
        pagina = pagina === undefined ? '1' : pagina
        nome = nome === undefined ? '' : nome
        


        const studentRepository = getRepository(Student)

        /* Lógica da projeção dos estudantes usando TypeORM
        *    SELECT *
            FROM students
            WHERE id BETWEEN inicio AND fim AND nome="%nome%"
        */

        /* Lógica do limite inferior: (limite * pagina) - limite 
        *  Exemplo: para limite=50 e pagina=2 temos: (50 * 2) - 50  = 100 - 50 = 50,
        *           ou seja, iniciar projeção de estudantes a partir da posição 50, sendo o 51º registro
        */
        const students = await studentRepository.find(
            {where: {nome: Like(`%${String(nome)}%`)},
            skip: Number.parseInt(String(limite)) * Number.parseInt(String(pagina)) - Number.parseInt(String(limite)) ,
            take: Number.parseInt(String(limite))}
            )
        
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
        
        // Aqui ocorre uma simples validação, verificando se o usuário deixou de inserir alguma informação
        !nome && res.status(400).json('O nome não foi informado.')
        !rga && res.status(400).json('O RGA não foi informado.')
        !curso && res.status(400).json('O curso não foi informado.')


        const studentsRepository = getRepository(Student)        
        
        const data = {
            nome,
            rga,
            curso
        }    

        this.validaRGA(rga)
                    
        const student = studentsRepository.create(data)
        
        await studentsRepository.save(student)
        return res.status(200).json(studentView.render(student)) 
    },


    /**
     * Método GET em /alunos:id
     * Listagem de um estudante, recebendo o id do estudante
     * Projeção da tabela students
     * Retorna um objeto Student que foi inserido na operação ou uma mensagem em JSON do objeto Response
    **/
    async showStudentById (req: Request, res: Response){
        const {id} = req.params

        const studentRepository = getRepository(Student)
        
        const student = await studentRepository.findOne({id: Number.parseInt(id)})    

        return student ? res.status(200).json(studentView.render(student)) : res.status(404).json({Erro: 'Estudante não encontrado.'})
    },

    /**
     * Método PUT em /alunos:id
     * Edição de um estudante já existente, recebendo o id do estudante
     * Atualizção na tabela students
     * Retorna um objeto Student que foi atualizado na operação ou uma mensagem em JSON do objeto Response
    **/
    async updateStudentById (req: Request, res: Response) {
        const {id} = req.params

        const   { nome, 
                rga,
                curso,
                registrado_em,
                situacao} = req.body

        
        

        const studentRepository = getRepository(Student)
        // Esvaziando array de erros antes da validação
        _errors = []

        this.validaDataeHora(registrado_em)     
        this.validaRGA(rga)
        this.validaSituacao(situacao)

        /* 
        * Em todas as ações do banco, o id deve ser transformado em uma variável do tipo Number para comparação 
        * no banco de dados pois o id registrado no banco de dados é numérico
        */
        return _errors.length === 0 

        ?                       

        // Atualização do atributo nome, sem validações adicionais
        nome !== undefined && await studentRepository.update(Number.parseInt(id), {nome: nome} )
        &&
        // Atualização do atributo rga, onde a validação do RGA é feita na chamada da função validaRGA()
        rga !== undefined && await studentRepository.update(Number.parseInt(id), {rga: rga})
        &&
        // Atualização do atributo nome, sem validações adicionais
        curso !== undefined && await studentRepository.update(Number.parseInt(id), {curso: curso} )          
        &&
        // Atualização do atributo registrado_em, onde a validação é efetuada pela função validaDataeHora()
        registrado_em !== undefined && await studentRepository.update(Number.parseInt(id), {registrado_em: registrado_em}) 
        &&   
        // Atualização do atributo situação, onde a validação da situação ocorre na função validaSituacao()
        situacao !== undefined && await studentRepository.update(Number.parseInt(id), {situacao: situacao})
        &&
        // Seleção do estudante atualizado
        this.showStudentById(req, res)

        :

        res.status(400).json(_errors)

    },


    /**
     * Método DELETE em /alunos:id
     * Remoção de um estudante, recebendo o id do estudante
     * Remoção na tabela students
     * Retorna um objeto Student que foi removido na operação
    **/
    async deleteStudentById (req: Request, res: Response){
        const { id } = req.params
        
        const studentRepository = getRepository(Student)

        await this.showStudentById(req, res)

        await studentRepository.delete({id: Number.parseInt(id)}).catch((e) => _errors.push(e) && res.status(404).json(_errors) )

    },

    /* Validação do RGA no formato NNNN.NNNN.NNN-NN 
    *   onde N é um número conforme definido.
    *  Verificação realizada utilizando RegEx
    *  Retorna o RGA se passar no teste, caso contrário retorna uma mensagem em JSON do objeto Response
    */
    
    validaRGA(rga: string){
        let regexRGA = /\d\d\d\d.\d\d\d\d.\d\d\d-\d\d/g
        let testeRGA = regexRGA.test(rga)      

        return testeRGA ? 
        rga : 
        _errors.push('O RGA está em um formato inválido. Seu formato é NNNN.NNNN.NNN-NN, onde N é um dígito de 0 a 9.') 
    },


     /* Validação do campo registrado_em no formato DD/MM/YYYY HH:mm:SS 
    *       onde D=dia[0-31], M=mês[1-12], Y=ano, H=hora[0-23], m=minuto[0-59] e S=segundo[0-59].
    *  Verificação realizada utilizando RegEx.
    *   Utilizada biblioteca moment pois no banco de dados está sendo salvo no formato 'DD/MM/YYYY HH:mm:ss',
    *   Retorna a data e hora formatada se passar no teste, caso contrário retorna uma mensagem em JSON do objeto Response
    */
    validaDataeHora(dataHora: string){
        let regexDataeHora = /^([1-9]|([012][0-9])|(3[01]))[\/]([0]{0,1}[1-9]|1[012])[\/]\d\d\d\d (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/g
        let testeDataeHora = regexDataeHora.test(dataHora)
        
        return testeDataeHora ?
        moment(dataHora, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : 
        _errors.push('A data e hora está em um formato inválido. O campo registrado_em deve ser do formato DD/MM/YYYY HH:mm:SS.')

    },

    /* 
    *   Validação do campo situação onde são aceitos apenas as palavras 'ativo' ou 'inativo'
    *   Retorna o true se 'ativo', false se 'inativo', caso contrário retorna uma mensagem em JSON do objeto Response
    */
    validaSituacao(situacao: string){
        return situacao.toLowerCase() === 'ativo' ? 
        true :
         (situacao.toLowerCase() === 'inativo' ? 
         false :
          _errors.push(`A situação está em um formato inválido. Os valores possíveis são 'ativo' ou 'inativo'.`))
    }

    
            
    
    

}
