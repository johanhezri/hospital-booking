import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'hospitals' })
export class Hospital {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Gleneagles Hospital', description: 'Name of the hospital' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 'Kuala Lumpur', description: 'Location of the hospital' })
  @Column({ name: 'address', nullable: true })
  address: string;

  @Column() timezone: string;
  @Column({ nullable: true }) smtp_host: string;
  @Column({ nullable: true }) smtp_user: string;
  @Column({ nullable: true }) smtp_pass: string;

  @ApiProperty({
    example: '2025-10-13T08:45:30.000Z',
    description: 'Timestamp when the hospital record was created (auto-generated)',
    readOnly: true,
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-13T09:15:45.000Z',
    description: 'Timestamp when the hospital record was last updated (auto-generated)',
    readOnly: true,
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'Timestamp when the hospital record was deleted (null if not deleted)',
    readOnly: true,
    nullable: true,
  })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}