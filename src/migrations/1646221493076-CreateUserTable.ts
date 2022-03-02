import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1646221493076 implements MigrationInterface {
    name = 'CreateUserTable1646221493076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "private"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "first_name_kana" character varying NOT NULL, "last_name_kana" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "private"."user"`);
    }

}
