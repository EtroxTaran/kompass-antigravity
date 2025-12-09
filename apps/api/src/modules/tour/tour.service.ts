import { Injectable, NotFoundException } from '@nestjs/common';
import { TourRepository } from './tour.repository';
import { CreateTourDto, UpdateTourDto } from './dto/tour.dto';

@Injectable()
export class TourService {
  constructor(private readonly repository: TourRepository) {}

  async create(dto: CreateTourDto, userId: string) {
    const tour: any = {
      ...dto,
      status: 'planned',
    };
    return this.repository.create(tour, userId);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const tour = await this.repository.findById(id);
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    return tour;
  }

  async update(id: string, dto: UpdateTourDto, userId: string) {
    return this.repository.update(id, dto, userId);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id, 'system');
  }
}
