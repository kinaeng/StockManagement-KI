import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminSuppliersService } from './admin-suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * ชุดทดสอบระบบบริการจัดการผู้จำหน่าย (AdminSuppliersService Unit Tests)
 */
describe('AdminSuppliersService', () => {
  let service: AdminSuppliersService;
  let mockSupplierRepository: Record<string, jest.Mock>;

  const mockSupplier: Supplier = {
    id: 1,
    code: 'SUP-001',
    name: 'บริษัท อะไหล่ไทย จำกัด',
    contactName: 'คุณสมชาย',
    phone: '081-234-5678',
    email: 'supplier@example.com',
    address: '123 ถนนวิภาวดี',
    taxId: '1234567890123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockSupplierRepository = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((supplier) => Promise.resolve({ id: 1, ...supplier })),
      find: jest.fn().mockResolvedValue([mockSupplier]),
      findOne: jest.fn().mockResolvedValue(mockSupplier),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminSuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    service = module.get<AdminSuppliersService>(AdminSuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * ทดสอบการสร้างผู้จำหน่ายรายใหม่
   */
  describe('create', () => {
    it('ควรสร้างและบันทึกผู้จำหน่ายใหม่สำเร็จ', async () => {
      const dto = {
        code: 'SUP-001',
        name: 'บริษัท อะไหล่ไทย จำกัด',
        contactName: 'คุณสมชาย',
      };

      const result = await service.create(dto);
      expect(mockSupplierRepository.create).toHaveBeenCalledWith(dto);
      expect(mockSupplierRepository.save).toHaveBeenCalled();
      expect(result.code).toEqual(dto.code);
    });
  });

  /**
   * ทดสอบการดึงรายการผู้จำหน่ายทั้งหมด
   */
  describe('findAll', () => {
    it('ควรคืนค่ารายการผู้จำหน่ายทั้งหมดในระบบ', async () => {
      const result = await service.findAll();
      expect(mockSupplierRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].code).toEqual(mockSupplier.code);
    });
  });

  /**
   * ทดสอบการค้นหาผู้จำหน่ายตาม ID
   */
  describe('findOne', () => {
    it('ควรคืนค่าข้อมูลผู้จำหน่ายเมื่อพบ ID', async () => {
      const result = await service.findOne(1);
      expect(mockSupplierRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockSupplier);
    });

    it('ควรโยน NotFoundException เมื่อไม่พบผู้จำหน่าย', async () => {
      mockSupplierRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * ทดสอบการแก้ไขข้อมูลผู้จำหน่าย
   */
  describe('update', () => {
    it('ควรแก้ไขข้อมูลผู้จำหน่ายสำเร็จ', async () => {
      const updateDto = { phone: '089-999-9999' };
      const result = await service.update(1, updateDto);
      expect(mockSupplierRepository.save).toHaveBeenCalled();
      expect(result.phone).toEqual(updateDto.phone);
    });
  });

  /**
   * ทดสอบการลบผู้จำหน่าย
   */
  describe('remove', () => {
    it('ควรลบผู้จำหน่ายสำเร็จเมื่อพบ ID', async () => {
      await service.remove(1);
      expect(mockSupplierRepository.remove).toHaveBeenCalledWith(mockSupplier);
    });
  });
});
