import Student from '../models/Student'

export default {
    render(student: Student) {
        return {
            id: student.id,
            nome: student.nome,
            rga: student.rga,
            curso: student.curso,
            registrado_em: student.registrado_em,
            situacao: student.situacao
        }
    },

    renderMany(students: Student[]) {
        return students.map(students => this.render(students))
    }
}