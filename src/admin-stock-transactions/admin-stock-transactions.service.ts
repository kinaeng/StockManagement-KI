import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockTransaction } from './entities/stock-transaction.entity';
import { StockTransactionItem } from './entities/stock-transaction-item.entity';
import { CreateStockTransactionDto } from './dto/create-stock-transaction.dto';
import { UpdateStockTransactionDto } from './dto/update-stock-transaction.dto';

@Injectable()
export class AdminStockTransactionsService {
  constructor(
    @InjectRepository(StockTransaction)
    private readonly stRepository: Repository<StockTransaction>,
    @InjectRepository(StockTransactionItem)
    private readonly itemRepository: Repository<StockTransactionItem>,
  ) {}

  async create(dto: CreateStockTransactionDto): Promise<StockTransaction> {
    const { items, ...stData } = dto;
    const stItems: StockTransactionItem[] = [];

    if (items && items.length > 0) {
      for (const itemDto of items) {
        const item = this.itemRepository.create(itemDto);
        stItems.push(item);
      }
    }

    const st = this.stRepository.create({
      ...stData,
      items: stItems,
    });

    return await this.stRepository.save(st);
  }

  async findAll(): Promise<StockTransaction[]> {
    return await this.stRepository.find({
      relations: { items: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<StockTransaction> {
    const st = await this.stRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!st) {
      throw new NotFoundException(`Stock Transaction with ID ${id} not found`);
    }
    return st;
  }

  async update(
    id: number,
    dto: UpdateStockTransactionDto,
  ): Promise<StockTransaction> {
    const st = await this.findOne(id);
    const { items, ...stData } = dto;

    Object.assign(st, stData);

    if (items) {
      await this.itemRepository.delete({ stockTransactionId: id });
      const stItems: StockTransactionItem[] = [];
      for (const itemDto of items) {
        const item = this.itemRepository.create({
          ...itemDto,
          stockTransactionId: id,
        });
        stItems.push(item);
      }
      st.items = stItems;
    }

    return await this.stRepository.save(st);
  }

  async remove(id: number): Promise<void> {
    const st = await this.findOne(id);
    await this.stRepository.remove(st);
  }
}
