# ADR 001: Backend Security Hardening (Helmet & Rate Limiting)

## Context & Problem Statement
ระบบ Stock Management จำเป็นต้องมีกลไกป้องกันการโจมตีทางไซเบอร์ตามมาตรฐานความปลอดภัย (Security Best Practices) เช่น การป้องกัน HTTP Header Vulnerabilities (XSS, Clickjacking, MIME sniffing) และการป้องกัน Brute-Force Authentication / API Flooding

## Decision
1. **HTTP Headers Protection**: ติดตั้งและเปิดใช้งาน `helmet` มิดเดิลแวร์ในระดับ Global Application (`main.ts`)
2. **API Rate Limiting**: ติดตั้ง `@nestjs/throttler` และลงทะเบียน `ThrottlerGuard` เป็น Global Guard ใน `app.module.ts`:
   - **Global Limit**: จำกัด 100 requests ต่อ 1 นาที (60,000 ms) สำหรับทุก API endpoint
   - **Auth Login Limit**: จำกัด 10 requests ต่อ 1 นาที สำหรับ `POST /auth/login` โดยใช้ `@Throttle()` เพื่อป้องกัน Password Brute-Force

## Consequences
- **Positive**:
  - ได้รับการปกป้องด้าน Header ความปลอดภัยตามมาตรฐาน OWASP
  - ป้องกันการยิงสุ่มรหัสผ่านที่หน้า Login
  - ระบบมีเสถียรภาพ ไม่ล่มง่ายจากการถูก Flooding
- **Negative**:
  - ผู้ใช้งานที่ส่งคำขอเกินลิมิตจะได้รับ `429 Too Many Requests` (ซึ่งเป็นพฤติกรรมที่ถูกต้อง)
