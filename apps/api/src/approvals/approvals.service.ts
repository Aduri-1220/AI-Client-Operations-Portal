import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval, ApprovalStatus } from './approval.entity';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class ApprovalsService {
  constructor(@InjectRepository(Approval) private readonly repo: Repository<Approval>) {}

  findAll(status?: string) {
    const where = status ? { status: status as ApprovalStatus } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const approval = await this.repo.findOne({ where: { id } });
    if (!approval) throw new NotFoundException(`Approval ${id} not found`);
    return approval;
  }

  create(dto: CreateApprovalDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateApprovalDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: ApprovalStatus, notes?: string) {
    await this.findOne(id);
    await this.repo.update(id, { status, ...(notes !== undefined ? { notes } : {}) });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
