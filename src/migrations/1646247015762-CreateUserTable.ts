import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1646247015762 implements MigrationInterface {
  name = 'CreateUserTable1646247015762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "private"."user_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "first_name_kana" character varying NOT NULL, "last_name_kana" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_517f1a649ad49fa1435e54b0d5f" UNIQUE ("email"), CONSTRAINT "PK_1e3ed533dd87e54f8de2a912187" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "private"."user_table"`);
  }
}
