import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVehicleCompatibility } from './entities/product-vehicle-compatibility.entity';
import { CreateProductVehicleCompatibilityDto } from './dto/create-product-vehicle-compatibility.dto';
import { UpdateProductVehicleCompatibilityDto } from './dto/update-product-vehicle-compatibility.dto';

@Injectable()
export class AdminProductVehicleCompatibilitiesService {
  constructor(
    @InjectRepository(ProductVehicleCompatibility)
    private readonly compatibilityRepository: Repository<ProductVehicleCompatibility>,
  ) {}

  async create(
    dto: CreateProductVehicleCompatibilityDto,
  ): Promise<ProductVehicleCompatibility> {
    const item = this.compatibilityRepository.create(dto);
    return await this.compatibilityRepository.save(item);
  }

  async findAll(): Promise<ProductVehicleCompatibility[]> {
    return await this.compatibilityRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<ProductVehicleCompatibility> {
    const item = await this.compatibilityRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Compatibility with ID ${id} not found`);
    }
    return item;
  }

  async update(
    id: number,
    dto: UpdateProductVehicleCompatibilityDto,
  ): Promise<ProductVehicleCompatibility> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return await this.compatibilityRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.compatibilityRepository.remove(item);
  }
}
