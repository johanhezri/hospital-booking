import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoles1760613468461 implements MigrationInterface {
    name = 'UpdateRoles1760613468461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "hospital_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "hospital_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "doctor_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "doctor_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "patient_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "patient_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_2d30747bbf78f942f465d4c73da" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_2d30747bbf78f942f465d4c73da"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "patient_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "patient_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "doctor_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "doctor_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "hospital_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "hospital_id" character varying NOT NULL`);
    }

}
