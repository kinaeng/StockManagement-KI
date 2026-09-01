# 01: Core Backend & Authentication

**What to build:** ตั้งค่าโปรเจกต์ (NestJS + Prisma + PostgreSQL) และสร้างระบบ Login ด้วย JWT ให้ทำงานได้จริงตั้งแต่หน้าจอเว็บไปจนถึงฐานข้อมูล เลิกใช้ Mock Data ในส่วนของ Auth

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] เชื่อมต่อ PostgreSQL ด้วย Prisma
- [ ] สร้าง User Table schema และรัน Migration
- [ ] สร้าง API Login (รับ Username/Password ส่งกลับ JWT)
- [ ] เปลี่ยนหน้า Login ใน Vue ให้เรียก API จริงและเก็บ Token
- [ ] ยืนยันว่าผู้ใช้ไม่สามารถเข้าหน้าอื่นได้ถ้าไม่มี Token ที่ถูกต้อง
