import moment from 'moment'
import Student from '../models/Student'

const formataData = (value: string) => value.replace('T',' ').replace('Z', '')

export default {
    render(student: Student) {
        return {
            id: student.id,
            nome: student.nome,
            rga: student.rga,
            curso: student.curso,
            registrado_em: `${moment(student.registrado_em).format('DD/MM/YYYY hh:mm:ss')}`,
            situacao: !student.situacao ? 'Inativo' : 'Ativo'
        }
    },

    renderMany(students: Student[]) {
        return students.map(students => this.render(students))
    }
}