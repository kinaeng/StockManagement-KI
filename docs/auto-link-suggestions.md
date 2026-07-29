# Auto-Link Suggestions Feature

## ภาพรวม

ฟีเจอร์คำแนะนำการเชื่อมโยงอัตโนมัติ (Auto-Link Suggestions) ช่วยให้ผู้ดูแลระบบสามารถเชื่อมโยงอะไหล่กับรุ่นรถได้อย่างรวดเร็ว โดยระบบจะแนะนำการเชื่อมโยงที่เป็นไปได้ตามการวิเคราะห์ข้อมูล

## โครงสร้างไฟล์

```
src/
├── components/parts/
│   └── AutoLinkSuggestions.vue     # Main component
├── services/
│   └── mockCompatibilityService.ts # Service layer (mock data)
└── pages/vehicles/
    └── compatibility.vue           # Updated page with new tab
```

## ฟีเจอร์หลัก

### 1. การแนะนำอัตโนมัติ
- ระบบวิเคราะห์รหัสแพลตฟอร์ม (Platform Code)  
- จับคู่ตามขนาดเครื่องยนต์และประเภทระบบ
- แสดงเปอร์เซ็นต์ความเชื่อมั่น (Confidence Level)

### 2. การจัดการเป็นชุด
- เลือกทั้งหมด / เลือกเฉพาะรายการ
- ยืนยันหลายรายการพร้อมกัน
- ปฏิเสธรายการที่ไม่ต้องการ

### 3. UI/UX Features
- Loading states และ empty states
- Warning สำหรับความเชื่อมั่นต่ำ (< 70%)
- Progress indicators สำหรับ async operations
- Responsive design

## การใช้งาน

### เข้าถึงฟีเจอร์
1. ไปที่หน้า "ตารางเปรียบเทียบความเข้ากันได้อะไหล่"
2. เลือกแท็บ "คำแนะนำอัตโนมัติ"

### การยืนยันคำแนะนำ
1. **รายเดียว**: กดปุ่ม ✓ ข้างรายการที่ต้องการ
2. **หลายรายการ**: 
   - เลือกรายการที่ต้องการ (checkbox)
   - กด "ยืนยันที่เลือก"

### การปฏิเสธคำแนะนำ
1. กดปุ่ม ✗ ข้างรายการที่ไม่ต้องการ
2. รายการจะหายไปและไม่แสดงอีก

## ข้อมูล Mock

### Platform Codes
- `HON-110-SCOOTER`: Honda 110cc scooters
- `YAM-155-SCOOTER`: Yamaha 155cc scooters  
- `HON-DISC-BRAKE-STD`: Honda standard disc brake
- `STD-LED-H4`: Standard LED H4 headlight
- `KAW-WET-CLUTCH`: Kawasaki wet clutch system

### Confidence Levels
- **90-100%**: สีเขียว - แนะนำขอ้อสูง
- **80-89%**: สีเขียวอ่อน - ดี
- **70-79%**: สีเหลือง - ปานกลาง
- **< 70%**: สีส้ม - ต่ำ (มี warning)

## Technical Implementation

### Service Layer Pattern
```typescript
// แทนที่ mock ด้วย API จริงในอนาคต
const suggestions = await compatibilityService.getSuggestions({
  excludeDismissed: true,
  minConfidence: 60,
  maxResults: 8
});
```

### Event Handling
```typescript
// Component events
@suggestion-confirmed   // รายการเดียวได้รับการยืนยัน
@suggestion-dismissed   // รายการเดียวถูกปฏิเสธ  
@bulk-confirmed        // หลายรายการได้รับการยืนยัน
```

### State Management
- ใช้ Vue 3 Composition API
- Reactive state สำหรับ loading และ selections
- Integration กับ existing composables

## การทดสอบ

### Mock Functions สำหรับทดสอบ
```typescript
import * as service from '@/services/mockCompatibilityService';

// ทดสอบ empty state
await service.getEmptySuggestions();

// ทดสอบ error handling  
await service.getErrorSuggestions();

// รีเซ็ต dismissed suggestions
service.resetDismissedSuggestions();
```

### Test Cases ที่ครอบคลุม
1. ✅ Normal suggestions display
2. ✅ Low confidence warnings (< 70%)
3. ✅ Dismissed suggestions filtering  
4. ✅ Empty state handling
5. ✅ Error state handling
6. ✅ Bulk operations
7. ✅ Loading states

## การปรับใช้ Production

### Backend Integration
1. แทนที่ `mockCompatibilityService.ts` ด้วย API service จริง
2. อัปเดต endpoints ใน service functions
3. จัดการ authentication และ error handling
4. เพิ่ม validation และ sanitization

### API Endpoints (แนะนำ)
```
GET  /api/compatibility/suggestions     # Get suggestions
POST /api/compatibility/suggestions/:id/confirm   # Confirm one
POST /api/compatibility/suggestions/:id/dismiss   # Dismiss one  
POST /api/compatibility/suggestions/bulk-confirm  # Bulk confirm
```

### Database Schema (แนะนำ)
```sql
-- suggestions table
suggestions (
  id, part_id, vehicle_id, platform_code, 
  source, confidence, status, created_at
)

-- dismissed_suggestions table  
dismissed_suggestions (
  id, user_id, suggestion_id, dismissed_at, reason
)
```

## การบำรุงรักษา

### TODO Comments
ไฟล์ทั้งหมดมี `// TODO:` comments ที่ระบุจุดที่ต้องแก้เมื่อต่อ backend จริง

### Logging
ระบบ log การทำงานของ mock service เพื่อช่วยในการ debug

### Performance
- ใช้ debounce สำหรับ search
- Lazy loading สำหรับ large datasets  
- Pagination สำหรับ suggestions มากๆ

---

**หมายเหตุ**: ฟีเจอร์นี้ออกแบบให้ทำงานกับ mock data ในขณะนี้ และพร้อมสำหรับการ integrate กับ backend จริงในอนาคตโดยแก้โค้ดน้อยที่สุด