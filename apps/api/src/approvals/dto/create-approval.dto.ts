import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApprovalDto {
  @ApiProperty() @IsString() @MinLength(2) title: string;
  @ApiProperty() @IsString() documentId: string;
  @ApiProperty() @IsString() requestedBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewerId?: string;
  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @IsOptional() @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
