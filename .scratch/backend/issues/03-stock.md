# 03: Stock Movement (Core Feature)

**What to build:** หน้าเว็บสามารถกด "รับเข้า", "เบิกออก", "ปรับปรุง" สต๊อกได้ โดยยิง API ไปบวกลบเลขที่หลังบ้าน (Simple Add/Subtract) 

**Blocked by:** 02: Products Management (Master Data)

**Status:** ready-for-agent

- [ ] สร้าง Stock / StockMovement Table schema และรัน Migration
- [ ] สร้าง API สำหรับเพิ่ม-ลดสต๊อกแบบง่าย (คำนวณและบันทึกลง Database)
- [ ] เปลี่ยนหน้าจอ Stock (In, Out, Adjust) ใน Vue ให้เชื่อมกับ API
- [ ] แสดงปริมาณสต๊อกล่าสุดบน UI จริง
- [ ] แสดง Error ที่หน้าเว็บเมื่อพยายามเบิกของมากกว่าที่มีในสต๊อก (ถ้าไม่อนุญาต)
