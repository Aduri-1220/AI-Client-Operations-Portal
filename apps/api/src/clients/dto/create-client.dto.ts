import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiProperty() @IsString() @MinLength(2) contactPerson: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsString() @MinLength(2) company: string;
  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'], default: 'ACTIVE' })
  @IsEnum(['ACTIVE', 'INACTIVE', 'PROSPECT'])
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' = 'ACTIVE';
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
