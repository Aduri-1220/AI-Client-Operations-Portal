import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Entity('approvals')
export class Approval {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() title: string;
  @ApiProperty() @Column({ name: 'document_id' }) documentId: string;
  @ApiProperty() @Column({ name: 'requested_by' }) requestedBy: string;
  @ApiProperty({ required: false }) @Column({ name: 'reviewer_id', nullable: true }) reviewerId: string;
  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @Column({ type: 'varchar', default: 'PENDING' }) status: ApprovalStatus;
  @ApiProperty({ required: false }) @Column({ nullable: true }) notes: string;
  @ApiProperty() @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @ApiProperty() @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
