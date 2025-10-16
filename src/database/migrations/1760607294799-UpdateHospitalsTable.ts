import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHospitalsTable1760607294799 implements MigrationInterface {
    name = 'UpdateHospitalsTable1760607294799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hospital_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "hospital_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6da026cf705d995e70c1b1c106b" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6da026cf705d995e70c1b1c106b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hospital_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "hospital_id" character varying NOT NULL`);
    }

}
