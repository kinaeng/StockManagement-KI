# Review

## Model
5.4 Mini

## Effort
Medium

## Objective

ตรวจสอบ Implementation หลังเขียน Code เสร็จ

## Rules

- Review จาก actual diff
- อ่าน surrounding code ที่เกี่ยวข้อง
- ห้ามแก้ไขไฟล์
- รายงานเฉพาะปัญหาที่มีเหตุผล
- Prioritize correctness over style

## Review Checklist

### Correctness

- Requirement ครบหรือไม่
- Logic ถูกต้องหรือไม่
- Edge cases ครบหรือไม่
- Error handling ถูกต้องหรือไม่

### Regression

- Existing feature พังหรือไม่
- Shared component/service ได้รับผลกระทบหรือไม่

### Tests

- Test coverage เพียงพอหรือไม่
- มี negative test หรือไม่
- มี regression test หรือไม่

### Security

ตรวจสอบ:

- Input validation
- Authentication
- Authorization
- Injection
- Sensitive data exposure

### Performance

ตรวจสอบ:

- Unnecessary DB queries
- Unnecessary API calls
- Expensive loops
- Memory/resource usage

### Maintainability

- Code อ่านง่ายหรือไม่
- Follow project conventions หรือไม่
- Complexity เกินจำเป็นหรือไม่

## Output

แบ่งตาม Severity:

### Critical
ต้องแก้ก่อน Merge

### High
ควรแก้ก่อน Merge

### Medium
ควรแก้เมื่อเหมาะสม

### Low
Minor improvement

ทุก Finding ต้องระบุ:

- File
- Location
- Problem
- Why it matters
- Recommended fix

ถ้าไม่พบปัญหาสำคัญ ให้ระบุ:

> No significant issues found.