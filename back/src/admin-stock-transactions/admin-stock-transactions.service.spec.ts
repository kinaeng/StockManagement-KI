import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminStockTransactionsService } from './admin-stock-transactions.service';
import { StockTransaction, TransactionType } from './entities/stock-transaction.entity';
import { StockTransactionItem } from './entities/stock-transaction-item.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * ชุดทดสอบระบบบริการรายการเคลื่อนไหวสต็อก (AdminStockTransactionsService Unit Tests)
 */
describe('AdminStockTransactionsService', () => {
  let service: AdminStockTransactionsService;
  let mockStRepository: Record<string, jest.Mock>;
  let mockItemRepository: Record<string, jest.Mock>;

  const mockTransaction: StockTransaction = {
    id: 1,
    transactionNumber: 'TX-IN-1001',
    transactionType: TransactionType.IN,
    referenceType: null as any,
    referenceId: null as any,
    warehouseId: 1,
    createdByUserId: 1,
    transactionDate: '2026-09-02',
    items: [],
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockStRepository = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((st) => Promise.resolve({ id: 1, ...st })),
      find: jest.fn().mockResolvedValue([mockTransaction]),
      findOne: jest.fn().mockResolvedValue(mockTransaction),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    mockItemRepository = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminStockTransactionsService,
        {
          provide: getRepositoryToken(StockTransaction),
          useValue: mockStRepository,
        },
        {
          provide: getRepositoryToken(StockTransactionItem),
          useValue: mockItemRepository,
        },
      ],
    }).compile();

    service = module.get<AdminStockTransactionsService>(AdminStockTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * ทดสอบการสร้าง Stock Transaction พร้อมรายการ items
   */
  describe('create', () => {
    it('ควรสร้างและบันทึกรายการเคลื่อนไหวสต็อกสำเร็จ', async () => {
      const dto = {
        transactionNumber: 'TX-IN-1001',
        transactionType: TransactionType.IN,
        warehouseId: 1,
        items: [
          {
            productId: 1,
            quantity: 10,
            unitCost: 150,
          },
        ],
      };

      const result = await service.create(dto);
      expect(mockItemRepository.create).toHaveBeenCalledWith(dto.items[0]);
      expect(mockStRepository.create).toHaveBeenCalled();
      expect(mockStRepository.save).toHaveBeenCalled();
      expect(result.transactionNumber).toEqual(dto.transactionNumber);
    });
  });

  /**
   * ทดสอบการดึงรายการเคลื่อนไหวสต็อกทั้งหมด
   */
  describe('findAll', () => {
    it('ควรคืนค่ารายการ Stock Transactions ทั้งหมดในระบบ', async () => {
      const result = await service.findAll();
      expect(mockStRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].transactionNumber).toEqual(mockTransaction.transactionNumber);
    });
  });

  /**
   * ทดสอบการค้นหาตาม ID
   */
  describe('findOne', () => {
    it('ควรคืนค่า Stock Transaction เมื่อพบ ID', async () => {
      const result = await service.findOne(1);
      expect(mockStRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { items: true },
      });
      expect(result).toEqual(mockTransaction);
    });

    it('ควรโยน NotFoundException เมื่อไม่พบรายการ', async () => {
      mockStRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
