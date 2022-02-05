import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1614142231288 implements MigrationInterface {
  name = 'CreateTableUsers1614142231288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "user" (
            "id" SERIAL NOT NULL,
            "firstName" character varying NOT NULL,
            "lastName" character varying NOT NULL,
            "firstNameKana" character varying NOT NULL,
            "lastNameKana" character varying NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
