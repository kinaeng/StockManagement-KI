## Problem Statement

ระบบ StockManagement-KI ในปัจจุบันมีเพียงส่วน Frontend (หน้ากาก) ซึ่งทำงานโดยใช้ Mock Data (ข้อมูลจำลอง) สำหรับการจัดการคลังสินค้า สินค้า ซัพพลายเออร์ และยานพาหนะ ทำให้ระบบไม่สามารถใช้งานจริงในโปรดักชันได้ ข้อมูลไม่มีการจัดเก็บอย่างถาวร (Persistence) และไม่มีระบบยืนยันตัวตน (Authentication) ที่ปลอดภัย

## Solution

สร้าง Backend (ระบบหลังบ้าน) เพื่อให้บริการ REST API แก่ Frontend โดยเชื่อมต่อกับฐานข้อมูลจริง เพื่อให้ระบบบริหารจัดการคลังสินค้าสามารถทำงานได้จริง บันทึกข้อมูลได้ถูกต้อง และมีการรักษาความปลอดภัยในการเข้าถึงข้อมูล 

## User Stories

1. As a system administrator, I want to login to the system using a secure method (JWT), so that unauthorized users cannot access the stock data.
2. As an inventory manager, I want to see the real-time list of products from the database, so that I know exactly what we have in stock.
3. As an inventory manager, I want to create, update, and delete products, so that the product catalog is always up to date.
4. As a warehouse worker, I want to record stock in (รับเข้า), stock out (เบิกออก), and stock adjustments (ปรับปรุงสต๊อก), so that the physical inventory matches the system.
5. As a purchasing officer, I want to manage suppliers and generate real purchase orders, so that procurement data is tracked in the system.
6. As a system user, I want the frontend to show clear loading, success, and error states based on real API responses, so that I can be confident my actions were successful.

## Implementation Decisions

- **Framework:** NestJS จะถูกใช้เป็นโครงสร้างหลักของ Backend API
- **Database:** PostgreSQL จะถูกใช้เป็น Relational Database
- **Authentication:** จะใช้ JWT (JSON Web Token) สำหรับการทำ Auth
- **ORM:** (รอการตัดสินใจ) ระหว่าง Prisma หรือ TypeORM
- **Repository Structure:** Monorepo (รวมอยู่ในโปรเจกต์เดียวกัน)
- **Stock Movement Logic:** Simple Add/Subtract (นับเพิ่ม-ลดตรงๆ)

## Testing Decisions

- **Unit Tests:** ทดสอบ business logic ภายใน service layers ของ NestJS (เช่น คำนวณสต๊อก)
- **Integration Tests:** ทดสอบ API endpoints แบบ end-to-end โดยเรียก HTTP requests และตรวจสอบข้อมูลที่บันทึกลง PostgreSQL (Test Database)
- ทดสอบพฤติกรรมภายนอก (External behavior) เช่น การตอบกลับเมื่อ token หมดอายุ, การบันทึกสต๊อกติดลบ (ถ้าไม่อนุญาต) เป็นต้น

## Out of Scope

- การเปลี่ยนหน้าตา UI (Visual Design) ใหม่ทั้งหมด (จะเน้นแค่การต่อ API และจัดการ State Feedback)
- การทำระบบ Report/Dashboard ที่ซับซ้อนเกินกว่าข้อมูลพื้นฐานในเฟสแรก

## Further Notes

อ้างอิงจากการสกัดหิน (ADR-001 และ ADR-002) การตัดสินใจบางอย่างได้รับการยืนยันแล้ว แต่ยังเหลือรายละเอียดบางส่วนที่ต้องตกลงกันก่อนเริ่มก่อสร้างถ้ำหลังบ้านอย่างเต็มรูปแบบ
