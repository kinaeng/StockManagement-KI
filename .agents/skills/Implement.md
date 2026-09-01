# Implement

## Model
5.6 Luna

## Effort
High

## Objective

Implement ตาม Plan และทำให้ Test ผ่าน

## Before Coding

อ่าน:

1. Explore Project
2. Plan
3. TDD
4. Relevant source files

## Rules

- ทำตาม Plan
- Follow existing conventions
- แก้เฉพาะส่วนที่จำเป็น
- Reuse existing code เมื่อเหมาะสม
- หลีกเลี่ยง unnecessary refactoring
- ไม่เพิ่ม dependency ถ้าไม่จำเป็น
- Preserve backward compatibility
- Handle errors properly
- คำนึงถึง security

## TDD Workflow

RED
↓
GREEN
↓
REFACTOR

## Implementation

ทำงานทีละขั้นตาม Plan

หลังจากแต่ละส่วน:

1. Run targeted test
2. ตรวจสอบ error
3. แก้ไขถ้าจำเป็น
4. ไปขั้นตอนถัดไป

## Validation

หลัง Implement เสร็จ:

- Run targeted tests
- Run related tests
- Run full test suite เมื่อเหมาะสม
- Run lint
- Run type check
- Run build
- Review git diff

## Output

### Changes Made

สรุปไฟล์ที่แก้และเหตุผล

### Tests

รายงาน Test ที่ Run และผลลัพธ์

### Remaining Issues

ระบุปัญหาที่ยังเหลือ

## Final Check

- [ ] Plan implemented
- [ ] Tests pass
- [ ] Build pass
- [ ] No unnecessary changes
- [ ] No obvious regression
- [ ] Code follows project conventions