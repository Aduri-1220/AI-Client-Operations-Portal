import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

class UpdateApprovalStatusDto {
  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}

@ApiTags('approvals')
@ApiBearerAuth()
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly service: ApprovalsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all approvals' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an approval request' })
  create(@Body() dto: CreateApprovalDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an approval' })
  update(@Param('id') id: string, @Body() dto: UpdateApprovalDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or reject a request' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateApprovalStatusDto) {
    return this.service.updateStatus(id, dto.status, dto.notes);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an approval' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
