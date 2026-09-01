# ADR 002: Authentication Strategy

## สถานะ (Status)
ได้รับการอนุมัติ (Approved)

## บริบท (Context)
ระบบเดิมใช้ข้อมูลผู้ใช้จำลอง (Mock Auth) ใน Frontend เราจำเป็นต้องมีระบบยืนยันตัวตนที่ปลอดภัยสำหรับการใช้งานจริง

## การตัดสินใจ (Decision)
เราจะใช้ **JWT (JSON Web Token)** สำหรับการยืนยันตัวตน (Authentication) และการตรวจสอบสิทธิ์ (Authorization) 

## ผลที่ตามมา (Consequences)
- Backend ต้องสร้างระบบออกเหรียญตรา (Issue JWT) และตรวจสอบเหรียญตรา (Verify JWT)
- Frontend ต้องเก็บ JWT อย่างปลอดภัย (เช่น ใน HttpOnly Cookie หรือ Local Storage ขึ้นอยู่กับการออกแบบเพิ่มเติม)
