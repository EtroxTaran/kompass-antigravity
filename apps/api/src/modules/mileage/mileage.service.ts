import { Injectable, NotFoundException } from '@nestjs/common';
import { MileageRepository } from './mileage.repository';
import { CreateMileageDto, UpdateMileageDto } from './dto/mileage.dto';

@Injectable()
export class MileageService {
  constructor(private readonly repository: MileageRepository) {}

  async create(dto: CreateMileageDto, userId: string) {
    const mileage: any = {
      ...dto,
      userId,
      status: 'draft',
    };
    return this.repository.create(mileage, userId);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const mileage = await this.repository.findById(id);
    if (!mileage) {
      throw new NotFoundException(`Mileage with ID ${id} not found`);
    }
    return mileage;
  }

  async update(id: string, dto: UpdateMileageDto, userId: string) {
    return this.repository.update(id, dto, userId);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id, 'system');
  }
}
