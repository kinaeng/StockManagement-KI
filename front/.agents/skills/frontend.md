agent_skill_md = """---
name: frontend-developer-event-ui
description: Guidelines and UI component standards for building clean, modern, responsive developer event websites with a blue accent and solid color palette.
---

# Frontend Developer Event UI Skill

Skill นี้กำหนดแนวทางและมาตรฐานในการสร้างและออกแบบหน้าเว็บกิจกรรมนักพัฒนา (Developer Event Website) ที่เน้นความสะอาด มินิมอล อ่านง่าย และรองรับทุกขนาดหน้าจอ

## 1. Design Rules & Constraints

- **Color Strategy:** ใช้สีน้ำเงิน (`#2563eb` / `blue-600`) เป็น **Primary Accent** (ไม่เกิน 10–15% ของหน้า)
- **No Gradients:** **ห้ามใช้การไล่ระดับสี (Gradients)** ให้ใช้สี Solid (สีตลับมาตรฐาน) เช่น White, Slate, และ Solid Blue เพื่อความคมชัด มินิมอล
- **Typography & Spacing:**
  - Font: Clean Sans-serif (เช่น Inter, -apple-system, Segoe UI)
  - Hierarchy: ใช้ขนาดและน้ำหนักตัวอักษรแบ่งความสำคัญอย่างชัดเจน
  - Layout Grid: 8px Grid System (`gap-4`, `gap-6`, `p-6`, `py-12`, `py-20`)
- **Responsiveness:**
  - Mobile (< 640px): Single Column, 16px Padding
  - Tablet (640px - 1024px): 2 Columns Grid, 24px Padding
  - Desktop (> 1024px): 3-4 Columns Grid, Max-width 1200px (`max-w-6xl`)
- **Public Image Sources:** ใช้รูปภาพตัวอย่างจากบริการสาธารณะ เช่น Unsplash Direct URLs (`https://images.unsplash.com/...`)

---

## 2. Component Design Tokens

```css
/* Color Map */
--color-accent: #2563eb;      /* Primary Accent (Blue 600) */
--color-accent-hover: #1d4ed8;/* Primary Hover (Blue 700) */
--color-accent-subtle: #eff6ff;/* Subdued Ice Blue (Blue 50) */

--color-bg-main: #ffffff;     /* Main Canvas */
--color-bg-surface: #f8fafc;  /* Cards / Alternate Section */
--color-border: #e2e8f0;      /* Standard Divider / Border */

--color-text-main: #0f172a;   /* Headings (Slate 900) */
--color-text-body: #334155;   /* Body Content (Slate 700) */
--color-text-muted: #64748b;  /* Meta / Captions (Slate 500) */