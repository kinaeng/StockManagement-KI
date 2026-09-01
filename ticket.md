# Tickets สำหรับสร้าง Backend (ย่อยระดับฟังก์ชัน)

## 01: ฐานคลังเสบียง (Database Init)
**What to build:** ติดตั้ง Prisma, เชื่อมต่อ PostgreSQL และตั้งค่า Schema เบื้องต้น
**Blocked by:** None
**Status:** ready-for-agent

- [ ] `npm install prisma` และ `npx prisma init`
- [ ] ตั้งค่า URL ของ PostgreSQL ใน `.env`
- [ ] สร้าง Script สำหรับเชื่อมต่อ Database

## 02: เวรยาม (Auth - Login)
**What to build:** สร้าง User Schema, API Login, คืนค่า JWT และต่อหน้าเว็บ
**Blocked by:** 01
**Status:** ready-for-agent

- [ ] สร้าง User schema (Prisma)
- [ ] สร้าง API `POST /auth/login` (คืนค่า JWT)
- [ ] แก้ไข Vue `login.vue` ให้เรียก API และเก็บ Token

## 03: ดูสมุดภาพเสบียง (Products - List)
**What to build:** สร้าง Product Schema และ API ดึงรายการสินค้าไปแสดงบนเว็บ
**Blocked by:** 02
**Status:** ready-for-agent

- [ ] สร้าง Product schema
- [ ] สร้าง API `GET /products`
- [ ] แก้ไข Vue `products/index.vue` ให้ดึงข้อมูลจริง

## 04: เพิ่มภาพเสบียง (Products - Create/Edit)
**What to build:** API สร้างและแก้ไขสินค้า + ต่อหน้าเว็บ
**Blocked by:** 03
**Status:** ready-for-agent

- [ ] สร้าง API `POST /products` และ `PUT /products/:id`
- [ ] แก้ไข Modal ใน Vue ให้บันทึกข้อมูลจริง
- [ ] แสดง Loading/Success เมื่อบันทึกสำเร็จ

## 05: ฉีกภาพเสบียงทิ้ง (Products - Delete)
**What to build:** API ลบสินค้า + ต่อหน้าเว็บ
**Blocked by:** 03
**Status:** ready-for-agent

- [ ] สร้าง API `DELETE /products/:id`
- [ ] แก้ไขปุ่มลบใน Vue ให้เรียก API และแสดง Alert สำเร็จ

## 06: ขนเสบียงเข้าถ้ำ (Stock - In)
**What to build:** สร้าง Stock Schema, API รับของเข้า (บวกเลข), และต่อหน้าเว็บ "รับเข้า"
**Blocked by:** 04
**Status:** ready-for-agent

- [ ] สร้าง Stock / StockMovement schema
- [ ] สร้าง API `POST /stock/in` เพื่อบวกสต๊อก
- [ ] แก้หน้า `stock/in.vue` ให้เรียก API จริง

## 07: เบิกเสบียงออก (Stock - Out)
**What to build:** API เบิกของออก (ลบเลข ตรวจว่าห้ามติดลบ), และต่อหน้าเว็บ "เบิกออก"
**Blocked by:** 06
**Status:** ready-for-agent

- [ ] สร้าง API `POST /stock/out` เพื่อตัดสต๊อก
- [ ] ใส่เงื่อนไขห้ามติดลบและส่ง Error กลับถ้าของไม่พอ
- [ ] แก้หน้า `stock/out.vue` ให้เรียก API จริง

## 08: นับเสบียงใหม่ (Stock - Adjust)
**What to build:** API ปรับปรุงยอดสต๊อกตรงๆ และต่อหน้าเว็บ "ปรับปรุง"
**Blocked by:** 06
**Status:** ready-for-agent

- [ ] สร้าง API `POST /stock/adjust` 
- [ ] แก้หน้า `stock/adjust.vue` ให้เรียก API จริง

## 09: สมุดรายชื่อพ่อค้า (Suppliers - List & Create)
**What to build:** Supplier Schema, API ดึงและสร้าง Supplier, และต่อหน้าเว็บ
**Blocked by:** 02
**Status:** ready-for-agent

- [ ] สร้าง Supplier schema
- [ ] สร้าง API `GET /suppliers` และ `POST /suppliers`
- [ ] แก้หน้า Suppliers ให้ทำงานได้จริง

## 10: สั่งซื้อเสบียง (Purchase Orders - Create)
**What to build:** PO Schema, API สร้างใบสั่งซื้อ, และต่อหน้าเว็บ
**Blocked by:** 04, 09
**Status:** ready-for-agent

- [ ] สร้าง PurchaseOrder schema
- [ ] สร้าง API `POST /purchase-orders`
- [ ] แก้หน้า Purchase Orders ใน Vue ให้เซฟได้จริง
