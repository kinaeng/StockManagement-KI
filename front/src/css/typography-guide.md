# Typography Guide - KI Stock Management System

## Typography Scale

### Font Sizes
```css
--font-size-xs: 0.75rem;     // 12px - Captions, labels
--font-size-sm: 0.875rem;    // 14px - Body text, form inputs
--font-size-base: 1rem;      // 16px - Default body text
--font-size-lg: 1.125rem;    // 18px - Large body text
--font-size-xl: 1.25rem;     // 20px - Section headings
--font-size-2xl: 1.5rem;     // 24px - Page headings
--font-size-3xl: 1.875rem;   // 30px - Display numbers
--font-size-4xl: 2.25rem;    // 36px - Large display text
```

### Font Weights
```css
--font-weight-light: 300;     // Light text
--font-weight-normal: 400;    // Default body text
--font-weight-medium: 500;    // Emphasis, buttons
--font-weight-semibold: 600;  // Subheadings, labels
--font-weight-bold: 700;      // Headings
--font-weight-extrabold: 800; // Display headings
```

## Usage Classes

### Font Size Classes
- `.text-xs` - Small captions and labels
- `.text-sm` - Form labels, table content
- `.text-base` - Default body text
- `.text-lg` - Large body text, descriptions
- `.text-xl` - Section headings
- `.text-2xl` - Page titles
- `.text-3xl` - Statistics, numbers
- `.text-4xl` - Large display text

### Font Weight Classes
- `.font-light` - Light emphasis
- `.font-normal` - Default text
- `.font-medium` - Buttons, emphasis
- `.font-semibold` - Subheadings
- `.font-bold` - Main headings
- `.font-extrabold` - Display headings

### Semantic Classes (Recommended)

#### Headings
```html
<!-- Page title -->
<h1 class="heading-page">จัดการสินค้า</h1>

<!-- Section heading -->
<h2 class="heading-section">รายการสินค้า</h2>

<!-- Large display text -->
<div class="heading-display">1,234</div>
```

#### Body Text
```html
<!-- Large body text -->
<p class="body-large">คำอธิบายที่สำคัญ</p>

<!-- Default body text -->
<p class="text-body">เนื้อหาปกติ</p>

<!-- Small body text -->
<p class="body-small">รายละเอียดเพิ่มเติม</p>
```

#### Labels & Captions
```html
<!-- Form label -->
<label class="label">ชื่อสินค้า</label>

<!-- Caption text -->
<div class="caption">อัปเดตล่าสุด: 29 ก.ค. 2026</div>
```

## Font Stack

### Primary (Inter + Noto Sans Thai)
```css
font-family: 'Inter', 'Noto Sans Thai', -apple-system, 'Segoe UI', Roboto, sans-serif;
```

**ใช้สำหรับ:**
- Headings
- UI elements
- Navigation
- Buttons

### Features
- **Antialiasing**: Smooth font rendering
- **Text rendering**: Optimized legibility
- **Tabular numbers**: Better number alignment in tables

## Best Practices

### 1. Hierarchy
```html
<!-- Good hierarchy -->
<h1 class="heading-page">หน้าหลัก</h1>
<h2 class="heading-section">สถิติสินค้า</h2>
<p class="text-body">รายละเอียด...</p>
<div class="caption">หมายเหตุ</div>
```

### 2. Readability
- ใช้ `line-height: 1.5` สำหรับ body text
- ใช้ `line-height: 1.25` สำหรับ headings
- เพิ่ม `letter-spacing` เล็กน้อยสำหรับ uppercase text

### 3. Color Contrast
- Main text: `--color-text-main` (#0f172a)
- Body text: `--color-text-body` (#334155)
- Muted text: `--color-text-muted` (#64748b)

### 4. Thai Text Considerations
- ใช้ Noto Sans Thai สำหรับ fallback
- อย่าใช้ letter-spacing กับข้อความไทย
- เพิ่ม line-height เล็กน้อยสำหรับข้อความไทยที่ยาว

## Examples

### Dashboard Stats
```html
<div class="stat-card">
  <div class="stat-card__value">1,234</div>
  <div class="stat-card__label">จำนวนสินค้าทั้งหมด</div>
</div>
```

### Table Headers
```html
<th class="font-semibold text-sm tracking-wide">ชื่อสินค้า</th>
```

### Form Elements
```html
<label class="label">รหัสสินค้า</label>
<input class="text-sm" placeholder="กรอกรหัสสินค้า">
<div class="caption text-muted">รหัสต้องเป็นตัวเลข 6 หลัก</div>
```