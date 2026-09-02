import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminProductsService } from './admin-products.service';
import { Product, ProductStatus } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * ชุดทดสอบระบบบริการจัดการสินค้า (AdminProductsService Unit Tests)
 */
describe('AdminProductsService', () => {
  let service: AdminProductsService;
  let mockProductRepository: Record<string, jest.Mock>;

  const mockProduct: Product = {
    id: 1,
    sku: 'WAVE-110I-BRAKE',
    barcode: '8850000000001',
    name: 'ผ้าเบรคหน้า Wave 110i',
    description: 'ผ้าเบรคคุณภาพสูง',
    categoryId: 1,
    unit: 'ชุด',
    unitPrice: 180,
    minStock: 10,
    maxStock: 100,
    status: ProductStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockProductRepository = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((product) => Promise.resolve({ id: 1, ...product })),
      find: jest.fn().mockResolvedValue([mockProduct]),
      findOne: jest.fn().mockResolvedValue(mockProduct),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<AdminProductsService>(AdminProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * ทดสอบการสร้างสินค้าใหม่
   */
  describe('create', () => {
    it('ควรสร้างและบันทึกสินค้าใหม่สำเร็จ', async () => {
      const dto = {
        sku: 'WAVE-110I-BRAKE',
        name: 'ผ้าเบรคหน้า Wave 110i',
        unit: 'ชุด',
        unitPrice: 180,
      };

      const result = await service.create(dto);
      expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepository.save).toHaveBeenCalled();
      expect(result.sku).toEqual(dto.sku);
    });
  });

  /**
   * ทดสอบการดึงรายการสินค้าทั้งหมด
   */
  describe('findAll', () => {
    it('ควรคืนค่ารายการสินค้าทั้งหมดในระบบ', async () => {
      const result = await service.findAll();
      expect(mockProductRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].sku).toEqual(mockProduct.sku);
    });
  });

  /**
   * ทดสอบการค้นหาสินค้าตาม ID
   */
  describe('findOne', () => {
    it('ควรคืนค่าข้อมูลสินค้าเมื่อพบ ID', async () => {
      const result = await service.findOne(1);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });

    it('ควรโยน NotFoundException เมื่อไม่พบสินค้า', async () => {
      mockProductRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * ทดสอบการแก้ไขข้อมูลสินค้า
   */
  describe('update', () => {
    it('ควรแก้ไขข้อมูลสินค้าสำเร็จ', async () => {
      const updateDto = { name: 'ผ้าเบรคหน้า Wave 110i (ปรับราคา)' };
      const result = await service.update(1, updateDto);
      expect(mockProductRepository.save).toHaveBeenCalled();
      expect(result.name).toEqual(updateDto.name);
    });
  });

  /**
   * ทดสอบการลบสินค้า
   */
  describe('remove', () => {
    it('ควรลบสินค้าสำเร็จเมื่อพบ ID', async () => {
      await service.remove(1);
      expect(mockProductRepository.remove).toHaveBeenCalledWith(mockProduct);
    });
  });
});
