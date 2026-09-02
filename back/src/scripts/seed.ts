import { AppDataSource } from '../data-source';
import { User, UserRole, UserStatus } from '../admin-users/entities/user.entity';
import { Warehouse } from '../admin-warehouses/entities/warehouse.entity';
import { WarehouseLocation } from '../admin-warehouse-locations/entities/warehouse-location.entity';
import { Category } from '../admin-categories/entities/category.entity';
import { Supplier } from '../admin-suppliers/entities/supplier.entity';
import { Product, ProductStatus } from '../admin-products/entities/product.entity';
import * as bcrypt from 'bcrypt';

/**
 * ฟังก์ชันสร้างข้อมูลเริ่มต้นสำหรับผู้ดูแลระบบ (Admin Seed)
 * @param dataSource DataSource ของ TypeORM
 */
export async function seedAdminUser(dataSource = AppDataSource): Promise<User> {
  const userRepository = dataSource.getRepository(User);

  let adminUser = await userRepository.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'ผู้ดูแลระบบ',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    adminUser = await userRepository.save(adminUser);
    console.log('✅ สร้างผู้ดูแลระบบสำเร็จ: admin / admin123');
  } else {
    console.log('ℹ️ ผู้ดูแลระบบ admin มีในระบบแล้ว');
  }

  return adminUser;
}

/**
 * ฟังก์ชันสร้างข้อมูลเริ่มต้นสำหรับระบบ (Full Dev Seed: Warehouses, Categories, Suppliers, Products)
 * @param dataSource DataSource ของ TypeORM
 */
export async function seedDevData(dataSource = AppDataSource): Promise<void> {
  await seedAdminUser(dataSource);

  const warehouseRepo = dataSource.getRepository(Warehouse);
  const locationRepo = dataSource.getRepository(WarehouseLocation);
  const categoryRepo = dataSource.getRepository(Category);
  const supplierRepo = dataSource.getRepository(Supplier);
  const productRepo = dataSource.getRepository(Product);

  // 1. Seed Warehouse
  let mainWarehouse = await warehouseRepo.findOne({ where: { code: 'WH-MAIN' } });
  if (!mainWarehouse) {
    mainWarehouse = warehouseRepo.create({
      code: 'WH-MAIN',
      name: 'คลังสินค้าหลัก',
      locationDescription: 'อาคารคลังสินค้าหลัก ชั้น 1',
    });
    mainWarehouse = await warehouseRepo.save(mainWarehouse);
    console.log('✅ สร้างคลังสินค้าหลักสำเร็จ');
  }

  // 2. Seed Location
  let defaultLocation = await locationRepo.findOne({ where: { locationCode: 'A-01-01' } });
  if (!defaultLocation && mainWarehouse) {
    defaultLocation = locationRepo.create({
      warehouseId: mainWarehouse.id,
      zone: 'A',
      shelf: '01',
      bin: '01',
      locationCode: 'A-01-01',
    });
    await locationRepo.save(defaultLocation);
    console.log('✅ สร้างตำแหน่งเก็บสินค้าสำเร็จ (A-01-01)');
  }

  // 3. Seed Category
  let brakeCategory = await categoryRepo.findOne({ where: { code: 'CAT-BRAKE' } });
  if (!brakeCategory) {
    brakeCategory = categoryRepo.create({
      code: 'CAT-BRAKE',
      name: 'ระบบเบรค',
    });
    brakeCategory = await categoryRepo.save(brakeCategory);
    console.log('✅ สร้างหมวดหมู่สินค้าสำเร็จ (ระบบเบรค)');
  }

  // 4. Seed Supplier
  let defaultSupplier = await supplierRepo.findOne({ where: { code: 'SUP-001' } });
  if (!defaultSupplier) {
    defaultSupplier = supplierRepo.create({
      code: 'SUP-001',
      name: 'บริษัท อะไหล่ไทย จำกัด',
      contactName: 'คุณสมชาย',
      phone: '081-234-5678',
      email: 'supplier@example.com',
      address: '123/45 ถนนวิภาวดี กรุงเทพฯ',
      taxId: '1234567890123',
    });
    await supplierRepo.save(defaultSupplier);
    console.log('✅ สร้างผู้จำหน่ายสำเร็จ (บริษัท อะไหล่ไทย จำกัด)');
  }

  // 5. Seed Products
  const existingProduct = await productRepo.findOne({ where: { sku: 'WAVE-110I-BRAKE' } });
  if (!existingProduct && brakeCategory) {
    const p1 = productRepo.create({
      sku: 'WAVE-110I-BRAKE',
      name: 'ผ้าเบรคหน้า Wave 110i',
      unit: 'ชุด',
      unitPrice: 180,
      minStock: 10,
      maxStock: 100,
      categoryId: brakeCategory.id,
      status: ProductStatus.ACTIVE,
    });
    const p2 = productRepo.create({
      sku: 'OIL-4T-10W30',
      name: 'น้ำมันเครื่อง 4T 10W-30',
      unit: 'กระป๋อง',
      unitPrice: 150,
      minStock: 5,
      maxStock: 50,
      categoryId: brakeCategory.id,
      status: ProductStatus.ACTIVE,
    });
    await productRepo.save([p1, p2]);
    console.log('✅ สร้างสินค้าเริ่มต้นสำเร็จ (ผ้าเบรค, น้ำมันเครื่อง)');
  }
}

/**
 * รัน Seed Script ตามอาร์กิวเมนต์จาก Command Line
 */
async function runSeedScript(): Promise<void> {
  try {
    await AppDataSource.initialize();
    const isAdminOnly = process.argv.includes('--admin-only');

    if (isAdminOnly) {
      await seedAdminUser();
    } else {
      await seedDevData();
    }

    console.log('🌱 Seed ข้อมูลสำเร็จสมบูรณ์!');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดขณะ Seed ข้อมูล:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

if (require.main === module) {
  runSeedScript();
}
