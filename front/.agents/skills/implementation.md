# ระบบจัดการสต็อกอะไหล่มอเตอร์ไซค์ (Motorcycle Parts Stock Management System)
## แผนการดำเนินงาน (Implementation Plan)

เอกสารฉบับนี้สรุปแผนการดำเนินงานสำหรับการพัฒนาระบบจัดการสต็อกอะไหล่มอเตอร์ไซค์ โดยอ้างอิงจากข้อกำหนดใน `requirement.md` และมาตรฐานการพัฒนาใน `Contribruting.md`

---

## 1. การแบ่ง Phase การทำงาน

### Phase 1: Frontend Project Setup & Foundation (เตรียมโครงสร้างและสถาปัตยกรรมหลัก)
- **Project Configuration:** 
  - ติดตั้งและตั้งค่า `husky`, `lint-staged`, และ `commitlint` ตามกฎใน `Contribruting.md`
  - ตรวจสอบและตั้งค่า ESLint / Prettier ให้พร้อมทำงาน
- **Layouts & Navigation:** 
  - สร้าง Main Layout ที่มี Header และ Sidebar สำหรับนำทางไปยังโมดูลหลักต่างๆ
- **Global Stores (Pinia):** 
  - สร้าง Store ระดับ Global สำหรับจัดการสิทธิ์และการเข้าสู่ระบบ เช่น `auth.store.ts`
- **Base Components:** 
  - สร้าง UI Components ส่วนกลางที่ใช้ซ้ำบ่อย เช่น `BaseTable`, `BaseModal`, `BaseInput`

---

### Phase 2: Frontend Core Features (UI & Composables Development)
พัฒนาหน้าจอ User Interface ทั้งหมดโดยใช้ Mock Data ในชั้น Composable ก่อนต่อ API จริง:
- **Auth Module:** หน้าจอ Login / Logout และจัดการ Auth Token
- **Product Management (จัดการสินค้า):**
  - หน้าแสดงรายการสินค้า ค้นหา และกรองข้อมูล (FR-1.1, FR-1.2)
  - ฟอร์มเพิ่ม/แก้ไข รายละเอียดสินค้า และเบอร์อะไหล่เทียบ (Cross-reference) (FR-1.3)
- **Vehicle Compatibility Management (จัดการความเข้ากันได้กับรุ่นรถ):**
  - หน้าจัดการข้อมูลรุ่นรถ ยี่ห้อ ปี และขนาด cc (FR-2.1)
  - ระบบจับคู่สินค้ากับรุ่นรถ (Many-to-Many) (FR-2.2)
  - หน้าจอค้นหา "เลือกรุ่นรถ → แสดงอะไหล่" และ "เลือกอะไหล่ → แสดงรุ่นรถ" (FR-2.3, FR-2.4)
- **Stock Management (จัดการสต็อก):**
  - หน้าบันทึกรับสินค้าเข้า (Stock In) และจ่ายออก (Stock Out) (FR-3.1, FR-3.2)
  - หน้าปรับปรุงสต็อก (Stock Adjustment) (FR-3.3)
  - หน้าแสดงสต็อกคงเหลือ Real-time และประวัติการเคลื่อนไหว (Stock Movement Log) (FR-3.4, FR-3.5)
  - ระบบแจ้งเตือนสต็อกต่ำกว่า Reorder Point (FR-4.1, FR-4.2)
- **Supplier & Purchase Order (ผู้จำหน่ายและใบสั่งซื้อ):**
  - หน้าจัดการข้อมูลผู้จำหน่าย (FR-5.1)
  - หน้าสร้างและติดตามใบสั่งซื้อ (PO) (FR-5.2)
- **Reports (ระบบรายงาน):**
  - รายงานสินค้าคงคลัง (Stock on Hand) (FR-6.1)
  - รายงานสินค้าเคลื่อนไหวเร็ว/ช้า (Fast/Slow moving) (FR-6.2)
  - รายงานประวัติเคลื่อนไหวและมูลค่าสต็อก (FR-6.3, FR-6.4)

---

### Phase 3: Backend Setup & API Development (NestJS)
- สร้างโครงสร้างโครงการ NestJS แบบ Modular Architecture
- ออกแบบ Database Schema และรัน Migration สำหรับ MySQL (ตาม Core Data Entities ใน requirement.md)
- พัฒนา RESTful APIs, Validation DTOs, Guards และ Authentication (JWT)

---

### Phase 4: Integration & System Testing
- เชื่อมต่อ Frontend (Composables) เข้ากับ Backend API ด้วย Axios
- ทดสอบความถูกต้องของข้อมูล (Data Consistency) และสอบทานตาม User Roles (Admin, พนักงานคลัง, พนักงานขาย)

---

## 2. แผนการตรวจสอบและควบคุมคุณภาพ (Verification Plan)
1. **Code Standards & Linting:** รัน `npm run lint` และอาศัย Husky Pre-commit hook ควบคุมคุณภาพโค้ด ห้ามใช้ `any` และระบุ Return Type ชัดเจนทุกฟังก์ชัน
2. **State Management Rule:** แยกแยะการใช้ Pinia Store เฉพาะข้อมูลที่ต้องแชร์ข้ามหลายหน้า ส่วนข้อมูลเฉพาะหน้าให้ใช้ Composable Local State
