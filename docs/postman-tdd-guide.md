# Postman TDD Guide

ชุดนี้ใช้สำหรับทดสอบ API ปัจจุบันของ backend ผ่าน Postman โดยเน้น flow แบบ TDD/contract test:

1. import `docs/postman-stockmanagement-environment.json`
2. import `docs/postman-stockmanagement-collection.json`
3. ตั้งค่า environment `username` และ `password` ให้ตรงกับ user ในฐานข้อมูล
4. รัน backend ที่ `http://localhost:3000`
5. รัน folder `Auth` ก่อน เพื่อเก็บ `token`
6. รัน folder `CRUD Resources` พร้อม data file `docs/postman-crud-data.json`
7. รัน folder `Audit Logs` พร้อม data file `docs/postman-audit-log-data.json`

หมายเหตุ: resource บางตัวต้องมีข้อมูลอ้างอิงอยู่ก่อน เช่น `productId`, `warehouseId`, `locationId`, `supplierId`, `vehicleId`, `createdByUserId`. ค่าเริ่มต้นใน data file ใช้ `1` เพื่อให้รันง่ายกับ seed database ถ้า database ของคุณใช้ id อื่น ให้แก้ไฟล์ data ก่อนรัน

Endpoint ที่ครอบคลุม:

- `POST /auth/login`
- `GET /`
- CRUD: `/admin/users`
- CRUD: `/admin/categories`
- CRUD: `/admin/products`
- CRUD: `/admin/vehicles`
- CRUD: `/admin/product-vehicle-compatibilities`
- CRUD: `/admin/warehouses`
- CRUD: `/admin/warehouse-locations`
- CRUD: `/admin/inventories`
- CRUD: `/admin/suppliers`
- CRUD: `/admin/purchase-orders`
- CRUD: `/admin/stock-transactions`
- CRUD: `/admin/stock-adjustments`
- CRUD: `/admin/stock-alerts`
- Audit log: `POST /admin/audit-logs`, `GET /admin/audit-logs`, `GET /admin/audit-logs/:id`
