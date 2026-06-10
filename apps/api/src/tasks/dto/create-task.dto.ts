import { IsDateString, IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty() @IsString() @MinLength(2) title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsUUID() projectId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assigneeId?: string;
  @ApiProperty({ enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] })
  @IsEnum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' = 'BACKLOG';
  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
  @ApiPropertyOptional({ enum: [1, 2, 3, 5, 8, 13] })
  @IsOptional() @IsNumber() @IsIn([1, 2, 3, 5, 8, 13]) storyPoints?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
}
