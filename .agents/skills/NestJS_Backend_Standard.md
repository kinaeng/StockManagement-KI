# 🚀 NestJS Backend Development Standards & Best Practices

> **Version:** 1.1.0  
> **Target Audience:** Backend Development Team  
> **Last Updated:** August 2026  

---

## 📌 Table of Contents
- [1. Project Architecture](#1-project-architecture)
- [2. Naming Conventions](#2-naming-conventions)
- [3. TypeScript & Coding Standards](#3-typescript--coding-standards)
- [4. API Design & RESTful Standards](#4-api-design--restful-standards)
- [5. DTOs & Request Validation](#5-dtos--request-validation)
- [6. Database & ORM Standards](#6-database--orm-standards)
- [7. Error Handling & Exception Filters](#7-error-handling--exception-filters)
- [8. Response Serialization](#8-response-serialization)
- [9. Authentication & Authorization](#9-authentication--authorization)
- [10. Environment & Configuration](#10-environment--configuration)
- [11. Logging & Observability](#11-logging--observability)
- [12. Testing Strategy](#12-testing-strategy)
- [13. Security Best Practices](#13-security-best-practices)
- [14. Code Readability & Performance Standards](#14-code-readability--performance-standards)

---

## 1. Project Architecture

เราใช้โครงสร้างแบบ **Modular / Feature-based Architecture** เพื่อความเป็นระเบียบและรองรับการขยายตัว (Scalability)

```text
src/
├── 📁 common/                  # Shared utilities, filters, decorators, guards
│   ├── 📁 decorators/          # Custom decorators (e.g., @CurrentUser, @Public)
│   ├── 📁 dto/                 # Common DTOs (e.g., PaginationDto)
│   ├── 📁 filters/             # Global exception filters
│   ├── 📁 guards/              # Custom guards (e.g., JwtAuthGuard, RolesGuard)
│   ├── 📁 interceptors/        # Global interceptors (e.g., TransformInterceptor)
│   ├── 📁 middleware/          # Custom middlewares
│   └── 📁 utils/               # Helper functions
├── 📁 config/                  # Configuration setup & env validation
├── 📁 modules/                 # Business Domain Modules
│   ├── 📁 auth/                # Auth Module
│   │   ├── 📁 dto/
│   │   ├── 📁 strategies/
│   │   ├── 📄 auth.controller.ts
│   │   ├── 📄 auth.module.ts
│   │   └── 📄 auth.service.ts
│   └── 📁 users/               # Users Module
│       ├── 📁 dto/
│       │   ├── 📄 create-user.dto.ts
│       │   └── 📄 update-user.dto.ts
│       ├── 📁 entities/
│       ├── 📄 users.controller.ts
│       ├── 📄 users.module.ts
│       ├── 📄 users.repository.ts
│       └── 📄 users.service.ts
├── 📁 database/                # Database configurations & migrations
├── 📄 app.module.ts            # Root module
└── 📄 main.ts                  # Application entry point
```

---

## 2. Naming Conventions

| Target | Format | Pattern / Rule | Example |
| :--- | :--- | :--- | :--- |
| **Files** | `kebab-case` | `[name].[type].ts` | `users.service.ts`, `create-user.dto.ts` |
| **Classes** | `PascalCase` | Descriptive Noun | `UsersService`, `CreateUserDto` |
| **Interfaces** | `PascalCase` | ห้ามขึ้นต้นด้วย `I` | `UserPayload`, `DatabaseConfig` |
| **Methods / Functions** | `camelCase` | Verb + Noun | `getUserById`, `calculateTotal` |
| **Variables** | `camelCase` | Descriptive Name | `totalAmount`, `isPaid` |
| **Constants** | `UPPER_SNAKE_CASE` | Capital letters with `_` | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| **Database Tables** | `snake_case` | Plural Noun | `users`, `order_items` |
| **Database Columns** | `snake_case` | Singular Noun | `created_at`, `first_name` |

---

## 3. TypeScript & Coding Standards

### 3.1 Explicit Return Types
ต้องระบุ Return Type ให้กับ Function/Method ทุกครั้งเสมอ

```typescript
// ❌ Bad
async findOne(id: string) {
  return this.userRepository.findOne(id);
}

// ✅ Good
async findOne(id: string): Promise<UserEntity> {
  return this.userRepository.findOne(id);
}
```

### 3.2 Avoid `any` Type
> ⚠️ **Warning:** ห้ามใช้ `any` เด็ดขาด หากไม่ทราบ Type ล่วงหน้าให้ใช้ `unknown` แล้วทำ Type Narrowing

### 3.3 Dependency Injection
ใช้ `private readonly` ใน Constructor Injection เพื่อความปลอดภัยและอ่านง่าย

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
}
```

### 3.4 Enums & Status
ใช้ Enum สำหรับค่าที่เป็น Constant Group หรือ State Status

```typescript
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
```

---

## 4. API Design & RESTful Standards

### 🛠️ HTTP Verbs Usage
* `GET` — ดึง/อ่านข้อมูล (Read)
* `POST` — สร้างข้อมูลใหม่ (Create)
* `PUT` — แก้ไข/แทนที่ข้อมูลทั้งชุด (Replace)
* `PATCH` — แก้ไขข้อมูลเฉพาะ Field (Partial Update)
* `DELETE` — ลบข้อมูล (Delete)

### 🔗 Resource Naming Rules
1. ใช้ **Plural Nouns** (พหูพจน์) เสมอ
2. ใช้ **kebab-case** สำหรับ URL Path

```http
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/orders
PATCH  /api/v1/orders/:id/status
```

---

## 5. DTOs & Request Validation

ใช้ `class-validator` และ `class-transformer` ควบคู่กับ `ValidationPipe`

### Example: `CreateUserDto`
```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' })
  password: string;
}
```

### Global Pipe Setup (`main.ts`)
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // ตัด field ที่ไม่ได้อยู่ใน DTO ออก
    forbidNonWhitelisted: true,  // แจ้ง error หากมี field แปลกปลอมส่งมา
    transform: true,              // แปลง payload เป็น DTO instance อัตโนมัติ
  }),
);
```

---

## 6. Database & ORM Standards

1. 🔄 **Transactions:** เมื่อมีการ CUD (Create, Update, Delete) หลายตารางเกี่ยวเนื่องกัน ต้องทำภายใต้ Transaction
2. 🗑️ **Soft Delete:** ข้อมูลหลัก เช่น Users, Orders ให้ใช้ `deletedAt: Date | null` แทนการลบแถวจริง
3. ⚡ **Indexing:** สร้าง Index บน Column ที่ใช้ ค้นหา/Filter บ่อย เช่น `email`, `status`, `created_at`
4. 🏗️ **Repository Pattern:** แยก Data Layer ออกจาก Business Logic (Service Layer)

---

## 7. Error Handling & Exception Filters

> 💡 **Rule:** ห้ามส่ง Unhandled Error / Plain Text Error กลับไปที่ Client ให้ใช้ Built-in Exception ของ NestJS เท่านั้น

```typescript
// ❌ Bad
if (!user) {
  throw new Error('User not found');
}

// ✅ Good
if (!user) {
  throw new NotFoundException(`User with ID ${id} not found`);
}
```

---

## 8. Response Serialization

Response ของทุก Endpoint จะต้องถูกครอบด้วย Format เดียวกันผ่าน Interceptor

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    "id": "usr_123",
    "email": "dev@company.com"
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5
  },
  "timestamp": "2026-08-31T13:00:00.000Z"
}
```

---

## 9. Authentication & Authorization

* 🔑 **Authentication:** ใช้ JWT Token (Short-lived Access Token + Long-lived Refresh Token)
* 🛡️ **Authorization:** ใช้ Guards ร่วมกับ Custom Decorator สำหรับ Role-Based Access Control (RBAC)

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }
}
```

---

## 10. Environment & Configuration

ใช้ `@nestjs/config` ร่วมกับ **Joi Validation** เพื่อตรวจสอบ Environment Variables ก่อน App Start

```typescript
// src/config/env.validation.ts
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
});
```

---

## 11. Logging & Observability

* 📝 ใช้ NestJS `Logger` หรือ Winston/Pino ทำ Structured JSON Logging
* 🚫 **ห้ามใช้ `console.log()`** ใน Codebase เด็ดขาด
* 🔒 **ห้าม Log ข้อมูล Sensitive Data** เช่น Passwords, Secrets, Credit Card

```typescript
private readonly logger = new Logger(UsersService.name);

async findOne(id: string) {
  this.logger.log(`Fetching user with ID: ${id}`);
  // ...
}
```

---

## 12. Testing Strategy

* 🧪 **Unit Tests (`*.spec.ts`):** ทดสอบ Business Logic ใน Service (ทำการ Mock Dependencies ทั้งหมด)
* 🔄 **E2E Tests (`*.e2e-spec.ts`):** ทดสอบ Integration Flow ตั้งแต่ API Controller ถึง Database
* 🎯 **Coverage Goal:** รักษา Code Coverage อยู่ที่อย่างน้อย **80%** สำหรับ Core Business Logic

---

## 13. Security Best Practices

1. 🛡️ **Helmet:** เปิดใช้ `helmet()` เพื่อป้องกัน HTTP Header Vulnerabilities
2. 🌐 **CORS:** กำหนด Whitelist Origin ชัดเจน (ห้ามใช้ `origin: '*'` ใน Prod)
3. ⏱️ **Rate Limiting:** เปิดใช้ `@nestjs/throttler` ป้องกัน Brute-Force & Flooding
4. 🔐 **Password Hashing:** ใช้ `argon2` หรือ `bcrypt` ในการ Hashing เสมอ

---

## 14. Code Readability & Performance Standards

> 💡 **Core Principle:** เขียนโค้ดให้อ่านง่าย สื่อสารชัดเจน และคำนึงถึง Performance เสมอ

### 14.1 Meaningful Naming Conventions
ตั้งชื่อตัวแปร, ฟังก์ชัน, และคลาสให้สื่อความหมายชัดเจน ไม่เน้นสั้น แต่เน้นให้อ่านแล้วเข้าใจวัตถุประสงค์ทันทีโดยไม่ต้องอ่าน Logic ทั้งหมด

```typescript
// ❌ Bad: เน้นชื่อสั้น แต่อ่านยาก ไม่รู้ว่าข้อมูลคืออะไร
const d = new Date();
const u = await this.userRepo.find();
const fn = (a: number, b: number) => a + b;

// ✅ Good: สื่อความหมายชัดเจน อ่านแล้วเข้าใจหน้าที่ทันที
const currentDate = new Date();
const activeUsers = await this.userRepo.findActiveUsers();
const calculateTotalPrice = (basePrice: number, taxRate: number): number => basePrice + taxRate;
```

### 14.2 Big-O & Loop Optimization
ใช้ Algorithm ที่มี Time Complexity (Big-O) ต่ำที่สุด หลีกเลี่ยง Loop ใน Loop (Nested Loops) ซึ่งเป็นสาเหตุหลักที่ทำให้ระบบประมวลผลช้าลงเมื่อข้อมูลมีขนาดใหญ่ขึ้น

* 🚫 **Avoid Nested Loops ($O(n^2)$):** หลีกเลี่ยงการใช้ `filter()`, `find()`, หรือ `some()` ซ้อนอยู่ภายใน `map()` หรือ `forEach()`
* ⚡ **Use Map / Set for $O(1)$ Lookup:** เปลี่ยนจากการค้นหาข้อมูลใน Array ซ้ำๆ ($O(n)$) ไปเป็นการใช้ Map หรือ Set เพื่อเพิ่มความเร็วในการ Lookup เหลือเพียง $O(1)$

```typescript
// ❌ Bad: Time Complexity O(n * m) - Loop ซ้อน Loop ทำให้เว็บช้าลงอย่างมากเมื่อข้อมูลเยอะ
const matchedOrders = orders.filter(order => 
  users.some(user => user.id === order.userId)
);

// ✅ Good: Time Complexity O(n + m) - แปลงเป็น Map เพื่อให้Lookup แบบ O(1) ประมวลผลได้เร็วมาก
const userMap = new Map(users.map(user => [user.id, user]));
const matchedOrders = orders.filter(order => userMap.has(order.userId));