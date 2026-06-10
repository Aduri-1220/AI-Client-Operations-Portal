import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../clients/client.entity';

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'UAT' | 'COMPLETED' | 'ON_HOLD';

@Entity('projects')
export class Project {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column({ name: 'client_id' }) clientId: string;
  @ManyToOne(() => Client) @JoinColumn({ name: 'client_id' }) client: Client;
  @ApiProperty() @Column({ name: 'start_date', type: 'date' }) startDate: string;
  @ApiProperty() @Column({ type: 'date' }) deadline: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2 }) budget: number;
  @ApiProperty({ enum: ['PLANNING', 'IN_PROGRESS', 'UAT', 'COMPLETED', 'ON_HOLD'] })
  @Column({ type: 'varchar', default: 'PLANNING' }) status: ProjectStatus;
  @ApiProperty() @Column({ type: 'simple-array', default: '' }) assignedTeam: string[];
  @ApiProperty({ required: false }) @Column({ nullable: true }) description: string;
  @ApiProperty() @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @ApiProperty() @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
