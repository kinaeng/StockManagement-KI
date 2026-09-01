# UI Point — Impeccable UI/UX Audit

> Scope: Frontend `front/src` ของ StockManagement-KI
> Mode: Audit / Documentation only
> **ยังไม่มีการแก้ไข, implement หรือ refactor source code จากการตรวจครั้งนี้**

## 1. Executive Summary

**คะแนน UI ปัจจุบัน: 7.4/10**

ภาพรวมมีพื้นฐาน UI ที่ดีและมีความพยายามสร้างระบบ Design System ผ่าน Base Components, SCSS variables และ layout ที่แบ่งเป็นหมวดหมู่ชัดเจน แต่ยังมีความไม่สม่ำเสมอระหว่างหน้า และมีปัญหา UX บางส่วนที่เกิดจากการที่หน้าจอยังผูกกับ mock/local data มากเกินไป

จุดที่ต้องให้ความสำคัญที่สุดไม่ใช่การเปลี่ยนหน้าตาทั้งระบบ แต่คือการทำให้ทุกหน้ารู้สึกว่าเป็นผลิตภัณฑ์เดียวกัน และทำให้ state ของข้อมูล/feedback ต่อผู้ใช้มีความน่าเชื่อถือเมื่อเชื่อม Backend จริง

---

## 2. Impeccable Review

### 2.1 Visual Hierarchy — 7.5/10

**ทำได้ดี**
- มี Page Header และโครงสร้างหน้าค่อนข้างชัด
- ตาราง/การ์ด/section แบ่งข้อมูลเป็นกลุ่มที่เข้าใจได้
- หน้าระบบ Stock, Products, Suppliers และ Vehicles มี information architecture ที่พอเดา flow ได้

**ควรปรับ**
- ลดจำนวน visual emphasis ที่แข่งขันกันในบางหน้า
- Primary action ควรมีจุดเด่นเพียง action หลักต่อ context
- ข้อมูลสำคัญ เช่น stock level, status, quantity และ movement type ควรมี hierarchy ที่ชัดกว่าข้อมูลประกอบ
- Empty/loading/error state ควรมี hierarchy เทียบเท่า success state ไม่ใช่แค่ข้อความธรรมดา

### 2.2 Consistency — 7/10

**ปัญหาหลัก**
- มี Base Components แล้ว แต่บางหน้าใช้ styling/spacing/interaction pattern ของตัวเอง
- Button, filter, modal และ table interaction ควรมี behavior เดียวกันทั้งระบบ
- สีของ status และ semantic meaning ต้องกำหนดจากระบบกลาง ไม่ควรตีความใหม่ในแต่ละหน้า
- ระยะห่างและ typography บางส่วนยังมีโอกาสเกิด drift เมื่อเพิ่มหน้าใหม่

**เป้าหมาย**
> ผู้ใช้ควรสามารถย้ายจาก Products → Stock → Purchase Orders ได้โดยไม่ต้องเรียนรู้ UI pattern ใหม่

### 2.3 UX / User Flow — 7/10

Flow โดยรวมเข้าใจได้ แต่มีความเสี่ยงจาก state ที่อยู่ใน composable/local mock data ทำให้ UI อาจดูเหมือนทำงานสำเร็จทั้งที่ยังไม่ได้ persist ข้อมูลจริง

สิ่งที่ต้องระวัง:
- หลัง create/update/delete ต้องมี feedback ที่ชัด
- ต้องแยก loading, success, empty และ error state
- destructive action ต้องมี confirmation ที่เหมาะสม
- filter/date/search ต้องรักษา state ตามที่ผู้ใช้คาดหวัง
- Stock movement เป็นหน้าที่ควรเน้นความถูกต้องของข้อมูลมากกว่าความสวยงาม

### 2.4 Accessibility — 6.8/10

ควรตรวจเพิ่มเติมใน implementation จริงเรื่อง:
- keyboard navigation
- focus state
- accessible label ของ icon-only buttons
- contrast ของ text/status badge
- form error message
- modal focus trap
- date/calendar control
- table semantics และ responsive behavior

Icon ไม่ควรถูกใช้แทนข้อความสำคัญโดยไม่มี accessible label

### 2.5 Responsive — 7/10

Desktop information density เหมาะกับระบบคลังสินค้า แต่ table-heavy screens ต้องออกแบบ mobile/tablet behavior ให้ชัดเจน

ควรตรวจ:
- table overflow
- filter toolbar wrapping
- modal width
- page header ที่มี action หลายตัว
- form columns บนหน้าจอเล็ก
- action buttons ในแต่ละ row

ไม่ควรแก้ด้วยการลด font/spacing อย่างเดียว เพราะจะทำให้ usability แย่ลง

### 2.6 Feedback & States — 6.5/10

นี่เป็นหนึ่งในพื้นที่ที่ควรยกระดับมากที่สุด

ทุก data-driven page ควรมีอย่างน้อย:

```text
Initial → Loading → Success
                  ├→ Empty
                  └→ Error

Mutation → Saving → Success / Error
```

ต้องระวังการใช้ mock/local state ที่ทำให้ UI แสดง success state โดยไม่มี server confirmation

---

## 3. Hardcode / Mock Data Audit

### 🔴 Critical

#### `front/src/composables/use-products.ts`
- มี product data ฝังอยู่ใน frontend
- ไม่ควรเป็น source of truth เมื่อระบบต่อ Backend จริง
- category/brand/stock-related values บางส่วนควรมาจาก API/domain data

#### `front/src/composables/use-stock.ts`
- stock movement/inventory data ถูกเก็บเป็น local/mock state
- เป็นข้อมูลสำคัญของระบบ จึงไม่ควรถือ source of truth ไว้ใน UI

#### `front/src/composables/use-suppliers.ts`
- supplier และ purchase-order data เป็น mock/local data
- มีความเสี่ยงเรื่อง consistency เมื่อหลายหน้าต้องใช้ข้อมูลชุดเดียวกัน

#### `front/src/composables/use-vehicles.ts`
- vehicle และ compatibility data ถูกสร้างใน frontend
- ควรแยก domain data ออกจาก presentation layer

#### `front/src/stores/auth.store.ts`
- authentication/user/token มีลักษณะ mock
- เป็นจุดที่ต้องเปลี่ยนเป็น server-backed authentication ก่อน production

#### `front/src/services/mockCompatibilityService.ts`
- เป็น mock service โดยตรง
- ควรถือว่าเป็น development/test implementation ไม่ใช่ production data source

### 🟠 High

#### `front/src/pages/reports/index.vue`
- มีการสร้างค่ารายงาน/สถิติจากข้อมูลจำลอง
- logic เช่นการแบ่ง Fast/Slow จาก local/generated values ไม่ควรถูกใช้แทน business calculation จริง

#### `front/src/pages/login.vue`
- มี mock/default authentication behavior
- ห้ามใช้เป็น production authentication flow

#### `front/src/pages/vehicles/compatibility.vue`
- image/suggestion flow ยังมีลักษณะ simulated/mock
- UI ควรสื่อสถานะว่าเป็น suggestion/analysis ที่ยังไม่ยืนยันจาก backend หากยังใช้ mock

### 🟡 Medium

#### `front/src/pages/products/index.vue`
- category/brand options บางส่วน hardcode ใน page
- หากข้อมูลเป็น master data ควรมี source กลาง/API

#### `front/src/pages/purchase-orders/index.vue`
- การสร้างเลข PO จากจำนวนรายการปัจจุบัน + 1 ไม่ปลอดภัยสำหรับข้อมูลจริง
- เลขเอกสารควรสร้างโดย backend/database หรือระบบ numbering กลาง

#### UI Text / i18n
- มีข้อความภาษาไทย hardcode ในหลายหน้า ขณะที่มี i18n structure อยู่แล้ว
- ควรแยก user-facing text ไปอยู่ใน locale files อย่างเป็นระบบ

---

## 4. Architecture / State Flow Finding

Current conceptual flow:

```text
Vue Page
   ↓
Composable
   ↓
Local ref / mock data
   ↓
Frontend memory
```

ปัญหาคือ composable ที่มี state แบบ local สามารถถูกสร้างหลาย instance:

```text
Products page ── useProducts() ── Instance A
Stock page    ── useProducts() ── Instance B
Dashboard     ── useProducts() ── Instance C
```

ดังนั้น mutation ใน instance หนึ่งไม่ได้รับประกันว่า instance อื่นจะเห็นข้อมูลเดียวกัน

**ข้อสังเกต:** นี่เป็น architectural finding สำหรับงานต่อไป ไม่ใช่คำสั่งให้ refactor ในรอบนี้

---

## 5. Priority Backlog

### P0 — ก่อน Production
1. เปลี่ยน Auth จาก mock เป็น Backend-backed authentication
2. เปลี่ยน Product/Inventory/Stock movement จาก mock เป็น API จริง
3. กำหนด source of truth ของ business data
4. ทำ loading/error/success state ให้ครบ
5. ป้องกันการแสดง mutation สำเร็จโดยไม่มี server confirmation

### P1 — UX Quality
1. ทำ interaction pattern ของ Button / Modal / Table / Filter ให้สม่ำเสมอ
2. รวม semantic status colors และ status mapping
3. ปรับ Stock Movement date/calendar interaction ให้คง state และเปลี่ยนเดือนได้ถูกต้อง
4. เพิ่ม empty/error states
5. ตรวจ responsive behavior ของ table-heavy screens

### P2 — Design System
1. ลด page-specific CSS ที่ซ้ำกับ Base Components
2. รวม spacing/typography/radius/shadow เป็น design tokens
3. ย้าย user-facing text ไป i18n
4. ทำ reusable patterns สำหรับ filters, search, confirmation และ forms

### P3 — Polish
1. micro-interactions
2. transition ที่จำเป็น
3. hover/focus states
4. visual refinement ของ dashboard/report cards
5. accessibility audit แบบละเอียด

---

## 6. หน้าที่ควรตรวจเป็นลำดับ

1. `stock/movements.vue` — critical operational flow
2. `stock/in.vue` / `stock/out.vue` / `stock/adjust.vue` — transaction correctness
3. `products/index.vue` — master data
4. `purchase-orders/index.vue` — document workflow
5. `reports/index.vue` — data credibility
6. `login.vue` — authentication UX
7. `vehicles/compatibility.vue` — suggestion/analysis UX

---

## 7. สิ่งที่ยังไม่ควรทำในรอบนี้

- ยังไม่ refactor composables
- ยังไม่ย้าย mock data
- ยังไม่เปลี่ยน API architecture
- ยังไม่แก้ source code
- ยังไม่เปลี่ยน visual design ทั้งระบบ

เอกสารนี้มีหน้าที่เป็น **audit + backlog สำหรับการ implement รอบถัดไปเท่านั้น**

---

## 8. Definition of Done สำหรับรอบ UI ถัดไป

ก่อนถือว่า UI production-ready ควรผ่านอย่างน้อย:

- [ ] ทุก business data มาจาก source of truth ที่กำหนดชัดเจน
- [ ] ไม่มี mock data หลุดเข้า production flow
- [ ] ทุก mutation มี loading/success/error feedback
- [ ] ทุกหน้ามี empty state
- [ ] ทุก interactive control มี keyboard/focus behavior
- [ ] responsive บน desktop/tablet/mobile
- [ ] status colors และ component behavior consistent
- [ ] user-facing text ใช้ i18n อย่างเป็นระบบ
- [ ] Stock movement/date interaction ผ่าน edge-case testing
- [ ] ไม่มี action สำคัญที่ดูเหมือนสำเร็จทั้งที่ backend ไม่ยืนยัน
