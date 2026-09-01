# CONTEXT.md — StockManagement-KI

## Project Context

**Project:** StockManagement-KI  
**Repository:** `D:\workkk\StockManagement-KI`  
**Frontend:** Vue 3 + Quasar + TypeScript/Vite structure  
**Backend:** NestJS  
**Database:** MySQL (project context)  

> This file is context/documentation only. It does not authorize implementation or refactoring.

---

## Current Scope

งานที่ตรวจในรอบนี้เน้น **Frontend UI/UX + Flow + Hardcode/Mock Data audit** โดยใช้แนวคิดจาก Impeccable เป็นกรอบในการประเมิน

### Explicit constraint

**ห้ามถือเอกสารนี้หรือ `UI_Point.md` เป็นคำสั่งให้แก้ source code**

รอบนี้ทำเฉพาะ:
- อ่านโครงสร้างและ flow ที่มีอยู่
- วิเคราะห์ UI/UX
- ตรวจ hardcode/mock data
- บันทึก findings
- จัดลำดับสิ่งที่ควรแก้ในอนาคต

ยังไม่ได้ทำ:
- implementation
- refactor
- API migration
- redesign source code
- เปลี่ยน behavior ของระบบ

---

## Frontend Structure ที่เกี่ยวข้อง

```text
front/src/
├── components/
│   ├── base/
│   └── parts/
├── composables/
├── css/
├── i18n/
├── layouts/
├── pages/
│   ├── products/
│   ├── purchase-orders/
│   ├── reports/
│   ├── stock/
│   │   ├── adjust.vue
│   │   ├── alerts.vue
│   │   ├── in.vue
│   │   ├── movements.vue
│   │   └── out.vue
│   ├── suppliers/
│   └── vehicles/
├── router/
├── services/
├── stores/
└── utils/
```

### Important files

| Area | File | Context |
|---|---|---|
| Products | `composables/use-products.ts` | Product state/data |
| Stock | `composables/use-stock.ts` | Stock/inventory/movement state |
| Suppliers | `composables/use-suppliers.ts` | Supplier/PO state |
| Vehicles | `composables/use-vehicles.ts` | Vehicle/compatibility state |
| Auth | `stores/auth.store.ts` | Authentication/user state |
| Compatibility | `services/mockCompatibilityService.ts` | Mock compatibility service |
| Stock Movement | `pages/stock/movements.vue` | Operational movement log |
| Stock In | `pages/stock/in.vue` | Receiving stock flow |
| Stock Out | `pages/stock/out.vue` | Issuing stock flow |
| Stock Adjust | `pages/stock/adjust.vue` | Stock adjustment flow |
| Products | `pages/products/index.vue` | Product management |
| Purchase Orders | `pages/purchase-orders/index.vue` | PO workflow |
| Reports | `pages/reports/index.vue` | Reporting/dashboard data |
| Login | `pages/login.vue` | Authentication UI |
| Compatibility | `pages/vehicles/compatibility.vue` | Vehicle compatibility UI |

---

## Existing UI Building Blocks

พบ Base Components ที่ควรถือเป็น foundation ของ UI system เช่น:

- `BaseTable.vue`
- `BaseModal.vue`
- `BasePageHeader.vue`
- `StatusBadge.vue`

มี SCSS/design variables และ i18n structure อยู่แล้ว ดังนั้นงานต่อไปควร **ต่อยอดจากระบบเดิม** ก่อนสร้าง abstraction ใหม่

---

## Current Data Flow Finding

ปัจจุบันหลายส่วนมีลักษณะ:

```text
Page
  ↓
Composable / Service
  ↓
Local ref / Mock Data
  ↓
Frontend Memory
```

แทนที่จะเป็น production flow:

```text
Page
  ↓
Composable / Store
  ↓
API Service
  ↓
NestJS Backend
  ↓
MySQL
```

### Important architectural observation

Local composable state อาจถูกสร้างหลาย instance เช่น:

```text
Products ── useProducts() ── A
Stock    ── useProducts() ── B
Dashboard── useProducts() ── C
```

ดังนั้นการ mutate state ใน instance หนึ่งไม่ได้หมายความว่าอีก instance จะได้รับข้อมูลเดียวกัน

นี่เป็น **finding** ไม่ใช่คำสั่ง refactor

---

## Hardcode / Mock Data Findings

### Critical

- `use-products.ts` — product data ฝังใน frontend
- `use-stock.ts` — stock/movement data เป็น local/mock
- `use-suppliers.ts` — supplier/PO data เป็น local/mock
- `use-vehicles.ts` — vehicle/compatibility data เป็น local/mock
- `auth.store.ts` — auth/user/token มี mock behavior
- `mockCompatibilityService.ts` — compatibility flow เป็น mock service

### High

- `reports/index.vue` — report metrics บางส่วนมาจาก generated/mock logic
- `login.vue` — authentication behavior ยังมี mock/default behavior
- `vehicles/compatibility.vue` — analysis/suggestion flow ยังพึ่ง simulated data

### Medium

- `products/index.vue` — category/brand options บางส่วน hardcode
- `purchase-orders/index.vue` — PO number generation จากจำนวนรายการ + 1 ไม่เหมาะเป็น production numbering
- user-facing Thai text บางส่วนยัง hardcode ทั้งที่มี i18n infrastructure

---

## UI Assessment Baseline

**Overall UI score:** `7.4 / 10`

คะแนนนี้ใช้เป็น baseline สำหรับรอบปรับปรุงถัดไป ไม่ใช่คะแนนคุณภาพ production ของระบบทั้งหมด

### Main strengths

- มี component structure ที่ดี
- Page structure ค่อนข้างชัด
- มี reusable Base Components
- มี i18n/design token foundation
- Domain pages ถูกแบ่งตามหน้าที่ของระบบ

### Main weaknesses

- consistency ระหว่างหน้า
- feedback/state handling
- responsive behavior ของ table-heavy screens
- accessibility details
- mock/local data ทำให้ความน่าเชื่อถือของ flow ลดลง
- user-facing text ยังไม่ผ่าน i18n ทั้งหมด

---

## Recommended Future Order

```text
P0 Production correctness
  1. Auth backend integration
  2. Products API
  3. Inventory/Stock movement API
  4. Supplier/PO API
  5. Server-confirmed mutation states

P1 UX
  1. Loading/Empty/Error/Success states
  2. Consistent filters/tables/modals/buttons
  3. Stock Movement date/calendar behavior
  4. Responsive table behavior

P2 Design System
  1. Shared status mapping
  2. Shared spacing/typography/tokens
  3. i18n completion
  4. Reusable form/filter patterns

P3 Polish
  1. Focus/hover states
  2. Accessibility audit
  3. Micro-interactions
  4. Visual polish
```

---

## Rules for Future Agents / Developers

1. **Do not start implementation from this file automatically.** Confirm the requested scope first.
2. Read the relevant existing page, composable, store and service before changing behavior.
3. Do not replace mock data blindly; identify the intended backend endpoint/domain contract first.
4. Do not introduce a new design system if an existing Base Component/token already covers the need.
5. Keep business data out of presentation components where possible.
6. Preserve existing route/domain naming unless there is a documented reason to change it.
7. Treat Stock Movement as an operationally sensitive flow: correctness > visual decoration.
8. Any production mutation should have explicit loading, success and error states.
9. Do not claim a mutation succeeded until the backend confirms it.
10. Any future UI changes should be checked against `UI_Point.md` to prevent visual drift.

---

## Documentation Pair

### `UI_Point.md`
Contains:
- Impeccable-style UI/UX assessment
- score
- hardcode/mock audit
- architecture findings
- prioritized UI backlog
- future Definition of Done

### `CONTEXT.md`
Contains:
- project context
- structure
- important files
- data-flow findings
- constraints
- rules for future work

Both documents are **planning/context artifacts only** for this audit round.
