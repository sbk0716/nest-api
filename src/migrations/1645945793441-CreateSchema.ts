import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1645945793441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "private"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "todoist"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS "private"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "todoist"`);
  }
}
