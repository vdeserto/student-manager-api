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
    
    @Column({type: 'text' ,default: () => 'datetime("now", "localtime")'})
    registrado_em: string;

    @Column({default: true})
    situacao: boolean;
}