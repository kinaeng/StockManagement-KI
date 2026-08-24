import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockAlert } from './entities/stock-alert.entity';
import { CreateStockAlertDto } from './dto/create-stock-alert.dto';
import { UpdateStockAlertDto } from './dto/update-stock-alert.dto';

@Injectable()
export class AdminStockAlertsService {
  constructor(
    @InjectRepository(StockAlert)
    private readonly alertRepository: Repository<StockAlert>,
  ) {}

  async create(dto: CreateStockAlertDto): Promise<StockAlert> {
    const alert = this.alertRepository.create(dto);
    return await this.alertRepository.save(alert);
  }

  async findAll(): Promise<StockAlert[]> {
    return await this.alertRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<StockAlert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Stock alert with ID ${id} not found`);
    }
    return alert;
  }

  async update(id: number, dto: UpdateStockAlertDto): Promise<StockAlert> {
    const alert = await this.findOne(id);
    Object.assign(alert, dto);
    return await this.alertRepository.save(alert);
  }

  async remove(id: number): Promise<void> {
    const alert = await this.findOne(id);
    await this.alertRepository.remove(alert);
  }
}
