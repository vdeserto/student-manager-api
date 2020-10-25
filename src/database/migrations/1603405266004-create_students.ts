import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createStudents1603405266004 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            // REALIZAR ALTERAÇÕES
        // CRIAR TABELA, CRIAR UM NOVO CAMPO, DELETAR ALGUM CAMPO
        await queryRunner.createTable(new Table(
            {
                name: 'students',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        unsigned: true,
                        isPrimary: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'nome',
                        type: 'varchar'
                    },
                    {
                        name: 'rga',
                        type: 'varchar',
                        scale: 15,
                    },
                    {
                        name: 'curso',
                        type: 'varchar',                       
                    },
                    {
                        name:'registrado_em',
                        type: 'datetime',
                        default: "datetime('now', 'localtime')"
                    },

                    {
                        name:'situacao',
                        type: 'boolean',
                        default: true
                    },
                ],
            }
        ))
    }
   

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('students')
    }

}
