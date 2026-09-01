# 02: Products Management (Master Data)

**What to build:** ทำให้หน้าจัดการสินค้า (Products) สามารถดึงข้อมูล สร้าง และลบสินค้าของจริงจากฐานข้อมูลได้ (ลบข้อมูลจำลองทิ้ง)

**Blocked by:** 01: Core Backend & Authentication

**Status:** ready-for-agent

- [ ] สร้าง Product Table schema และรัน Migration
- [ ] สร้าง API สำหรับดึงรายการ (GET), สร้าง (POST), และลบ (DELETE) สินค้า
- [ ] ป้องกัน API ด้วย JWT Auth Guard
- [ ] เปลี่ยนหน้าจอ Products ใน Vue ให้เรียก API จริง
- [ ] เพิ่มสถานะ Loading, Success และ Error บน UI เมื่อมีการบันทึกข้อมูล
