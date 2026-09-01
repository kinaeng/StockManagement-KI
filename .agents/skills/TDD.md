# TDD

## Model
5.6 Terra

## Effort
Medium

## Objective

ใช้ Test-Driven Development เพื่อให้มั่นใจว่า Implementation ตรงตาม Requirement

## Workflow

RED → GREEN → REFACTOR

## Rules

- เขียน Test ก่อน Implementation
- ใช้ Testing Framework เดิมของ Project
- Follow existing test conventions
- Test behavior ไม่ใช่ implementation detail
- Test ต้อง deterministic
- ห้ามแก้ Test เพียงเพื่อทำให้ Test ผ่าน
- เพิ่ม Regression Test เมื่อพบ Bug

## Test Coverage

### Happy Path

Test การทำงานปกติ

### Edge Cases

ตรวจสอบ:

- Empty input
- Null / missing value
- Boundary values
- Invalid input
- Duplicate data
- Large input

### Error Cases

ตรวจสอบ:

- Validation error
- Not found
- Unauthorized
- Forbidden
- Database error
- API error
- External service failure

### Regression

สร้าง Test สำหรับ Bug หรือ behavior ที่ไม่ควรกลับมาเสียอีก

## Output

### Test Cases

| Test | Given | When | Then |
|---|---|---|---|
| ... | ... | ... | ... |

### Test Files

ระบุ Test file ที่ต้องสร้างหรือแก้

### Expected Behavior

อธิบายผลลัพธ์ที่ Test ต้องการ

## Execution

1. เขียน Test
2. Run Test → ต้องเห็น RED
3. Implement ขั้นต่ำ
4. Run Test → GREEN
5. Refactor
6. Run Test อีกครั้ง

## Completion Criteria

- [ ] Happy path covered
- [ ] Edge cases covered
- [ ] Error cases covered
- [ ] Regression covered
- [ ] Tests pass