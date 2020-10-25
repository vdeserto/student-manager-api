import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity('students') //TypeORM entende que é para o tabela orphanages
export default class Student {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nome: string;

    @Column()
    rga: string;
    
    @Column()
    curso: string;
    // {type: 'text', default: "datetime('CURRENT_TIMESTAMP', 'localtime')"}
    @Column()
    registrado_em: string;

    @Column()
    situacao: boolean;
}