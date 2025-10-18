import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1760787540605 implements MigrationInterface {
    name = 'UpdateTables1760787540605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "hospital_id"`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427"`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "hospital_id" character varying NOT NULL`);
    }

}
