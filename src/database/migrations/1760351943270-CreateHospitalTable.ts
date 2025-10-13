import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHospitalTable1760351943270 implements MigrationInterface {
    name = 'CreateHospitalTable1760351943270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hospital" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hospital"`);
    }

}
