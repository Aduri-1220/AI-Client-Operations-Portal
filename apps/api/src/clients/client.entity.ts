import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT';

@Entity('clients')
export class Client {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column({ name: 'contact_person' }) contactPerson: string;
  @ApiProperty() @Column({ unique: true }) email: string;
  @ApiProperty() @Column() phone: string;
  @ApiProperty() @Column() company: string;
  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'] }) @Column({ type: 'varchar', default: 'ACTIVE' }) status: ClientStatus;
  @ApiProperty({ required: false }) @Column({ nullable: true }) notes: string;
  @ApiProperty() @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @ApiProperty() @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
