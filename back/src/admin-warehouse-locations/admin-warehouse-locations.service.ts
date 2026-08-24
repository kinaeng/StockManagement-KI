import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseLocation } from './entities/warehouse-location.entity';
import { CreateWarehouseLocationDto } from './dto/create-warehouse-location.dto';
import { UpdateWarehouseLocationDto } from './dto/update-warehouse-location.dto';

@Injectable()
export class AdminWarehouseLocationsService {
  constructor(
    @InjectRepository(WarehouseLocation)
    private readonly locationRepository: Repository<WarehouseLocation>,
  ) {}

  async create(dto: CreateWarehouseLocationDto): Promise<WarehouseLocation> {
    const location = this.locationRepository.create(dto);
    return await this.locationRepository.save(location);
  }

  async findAll(): Promise<WarehouseLocation[]> {
    return await this.locationRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<WarehouseLocation> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Warehouse location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: number,
    dto: UpdateWarehouseLocationDto,
  ): Promise<WarehouseLocation> {
    const location = await this.findOne(id);
    Object.assign(location, dto);
    return await this.locationRepository.save(location);
  }

  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }
}
