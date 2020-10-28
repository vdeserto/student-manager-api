import moment from 'moment'
import Student from '../models/Student'

export default {
    render(student: Student) {
        return {
            id: student.id,
            nome: student.nome,
            rga: student.rga,
            curso: student.curso,
            registrado_em: `${moment(student.registrado_em).format('DD/MM/YYYY HH:mm:ss')}`,
            situacao: !student.situacao ? 'inativo' : 'ativo'
        }
    },

    renderMany(students: Student[]) {
        return students.map(students => this.render(students))
    }
}