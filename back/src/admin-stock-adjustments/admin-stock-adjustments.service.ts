import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { StockAdjustmentItem } from './entities/stock-adjustment-item.entity';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock-adjustment.dto';

@Injectable()
export class AdminStockAdjustmentsService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly saRepository: Repository<StockAdjustment>,
    @InjectRepository(StockAdjustmentItem)
    private readonly itemRepository: Repository<StockAdjustmentItem>,
  ) {}

  async create(dto: CreateStockAdjustmentDto): Promise<StockAdjustment> {
    const { items, ...saData } = dto;
    const saItems: StockAdjustmentItem[] = [];

    if (items && items.length > 0) {
      for (const itemDto of items) {
        const diffQty = itemDto.actualQty - itemDto.systemQty;
        const item = this.itemRepository.create({
          ...itemDto,
          diffQty,
        });
        saItems.push(item);
      }
    }

    const sa = this.saRepository.create({
      ...saData,
      items: saItems,
    });

    return await this.saRepository.save(sa);
  }

  async findAll(): Promise<StockAdjustment[]> {
    return await this.saRepository.find({
      relations: { items: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<StockAdjustment> {
    const sa = await this.saRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!sa) {
      throw new NotFoundException(`Stock Adjustment with ID ${id} not found`);
    }
    return sa;
  }

  async update(
    id: number,
    dto: UpdateStockAdjustmentDto,
  ): Promise<StockAdjustment> {
    const sa = await this.findOne(id);
    const { items, ...saData } = dto;

    Object.assign(sa, saData);

    if (items) {
      await this.itemRepository.delete({ stockAdjustmentId: id });
      const saItems: StockAdjustmentItem[] = [];
      for (const itemDto of items) {
        const diffQty = itemDto.actualQty - itemDto.systemQty;
        const item = this.itemRepository.create({
          ...itemDto,
          stockAdjustmentId: id,
          diffQty,
        });
        saItems.push(item);
      }
      sa.items = saItems;
    }

    return await this.saRepository.save(sa);
  }

  async remove(id: number): Promise<void> {
    const sa = await this.findOne(id);
    await this.saRepository.remove(sa);
  }
}
