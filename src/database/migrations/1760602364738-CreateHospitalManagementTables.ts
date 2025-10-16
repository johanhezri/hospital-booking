import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHospitalManagementTables1760602364738 implements MigrationInterface {
    name = 'CreateHospitalManagementTables1760602364738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'staff', 'patient')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospital_id" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "name" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshTokenHash" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_708baeaac37a95857fc881b7f9" ON "users" ("refreshTokenHash") `);
        await queryRunner.query(`CREATE TABLE "doctors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospital_id" character varying NOT NULL, "name" character varying NOT NULL, "specialty" character varying NOT NULL, "slotDurationMinutes" integer NOT NULL DEFAULT '15', CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_working_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospital_id" character varying NOT NULL, "doctor_id" character varying NOT NULL, "weekday" integer NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4cc3fe0d42983fd973a5bc9e44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('booked', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospital_id" character varying NOT NULL, "doctor_id" character varying NOT NULL, "patient_id" character varying NOT NULL, "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."appointments_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "created_by_staff_id" character varying, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df1385b6833e75f281f0ebdf66" ON "appointments" ("created_by_staff_id") `);
        await queryRunner.query(`ALTER TABLE "hospitals" ADD "timezone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hospitals" ADD "smtp_host" character varying`);
        await queryRunner.query(`ALTER TABLE "hospitals" ADD "smtp_user" character varying`);
        await queryRunner.query(`ALTER TABLE "hospitals" ADD "smtp_pass" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hospitals" DROP COLUMN "smtp_pass"`);
        await queryRunner.query(`ALTER TABLE "hospitals" DROP COLUMN "smtp_user"`);
        await queryRunner.query(`ALTER TABLE "hospitals" DROP COLUMN "smtp_host"`);
        await queryRunner.query(`ALTER TABLE "hospitals" DROP COLUMN "timezone"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df1385b6833e75f281f0ebdf66"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP TABLE "doctor_working_schedules"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_708baeaac37a95857fc881b7f9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
