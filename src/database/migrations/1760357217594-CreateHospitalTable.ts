import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHospitalTable1760357217594 implements MigrationInterface {
    name = 'CreateHospitalTable1760357217594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hospitals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_02738c80d71453bc3e369a01766" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hospitals"`);
    }

}
