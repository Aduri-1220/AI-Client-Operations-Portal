import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../projects/project.entity';

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

@Entity('tasks')
export class Task {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() title: string;
  @ApiProperty({ required: false }) @Column({ nullable: true }) description: string;
  @ApiProperty() @Column({ name: 'project_id' }) projectId: string;
  @ManyToOne(() => Project) @JoinColumn({ name: 'project_id' }) project: Project;
  @ApiProperty({ required: false }) @Column({ name: 'assignee_id', nullable: true }) assigneeId: string;
  @ApiProperty({ enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] })
  @Column({ type: 'varchar', default: 'BACKLOG' }) status: TaskStatus;
  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @Column({ type: 'varchar', default: 'MEDIUM' }) priority: TaskPriority;
  @ApiProperty({ required: false }) @Column({ name: 'story_points', nullable: true }) storyPoints: number;
  @ApiProperty({ required: false }) @Column({ name: 'due_date', nullable: true, type: 'date' }) dueDate: string;
  @ApiProperty() @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @ApiProperty() @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
