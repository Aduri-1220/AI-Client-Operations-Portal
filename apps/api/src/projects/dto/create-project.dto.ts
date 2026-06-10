import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiProperty() @IsUUID() clientId: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() deadline: string;
  @ApiProperty() @IsNumber() @Min(0) budget: number;
  @ApiProperty({ enum: ['PLANNING', 'IN_PROGRESS', 'UAT', 'COMPLETED', 'ON_HOLD'] })
  @IsEnum(['PLANNING', 'IN_PROGRESS', 'UAT', 'COMPLETED', 'ON_HOLD'])
  status: 'PLANNING' | 'IN_PROGRESS' | 'UAT' | 'COMPLETED' | 'ON_HOLD' = 'PLANNING';
  @ApiPropertyOptional() @IsOptional() @IsArray() assignedTeam?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}
