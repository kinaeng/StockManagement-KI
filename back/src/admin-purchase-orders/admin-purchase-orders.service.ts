import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class AdminPurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly itemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const { items, ...poData } = dto;

    let totalAmount = 0;
    const poItems: PurchaseOrderItem[] = [];

    if (items && items.length > 0) {
      for (const itemDto of items) {
        const totalPrice = itemDto.orderedQty * itemDto.unitCost;
        totalAmount += totalPrice;

        const item = this.itemRepository.create({
          ...itemDto,
          totalPrice,
        });
        poItems.push(item);
      }
    }

    const po = this.poRepository.create({
      ...poData,
      totalAmount,
      items: poItems,
    });

    return await this.poRepository.save(po);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return await this.poRepository.find({
      relations: { items: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }
    return po;
  }

  async update(id: number, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    const { items, ...poData } = dto;

    Object.assign(po, poData);

    if (items) {
      await this.itemRepository.delete({ purchaseOrderId: id });
      let totalAmount = 0;
      const poItems: PurchaseOrderItem[] = [];
      for (const itemDto of items) {
        const totalPrice = itemDto.orderedQty * itemDto.unitCost;
        totalAmount += totalPrice;
        const item = this.itemRepository.create({
          ...itemDto,
          purchaseOrderId: id,
          totalPrice,
        });
        poItems.push(item);
      }
      po.items = poItems;
      po.totalAmount = totalAmount;
    }

    return await this.poRepository.save(po);
  }

  async remove(id: number): Promise<void> {
    const po = await this.findOne(id);
    await this.poRepository.remove(po);
  }
}
