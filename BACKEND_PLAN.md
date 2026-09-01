# Backend Completion Plan — StockManagement-KI

> Working method: `@grill-with-docs` principles from `.agents/skills/grill-with-docs/SKILL.md`.
> Scope: Backend completion, with Frontend contracts used as evidence.
> Current phase: Explore / Domain Model / Plan. No broad backend refactor has started.

## 1. Evidence-Based Snapshot

### Runtime stack found in source

- NestJS 11
- TypeORM
- PostgreSQL driver (`pg`)
- class-validator / class-transformer
- Jest / Supertest
- Database migrations through TypeORM

**Important:** repository source currently configures PostgreSQL, not MySQL. The backend code and `.env.example` both use PostgreSQL defaults. This document treats PostgreSQL as the current source-of-truth until an explicit database decision changes it.

### Existing domains

- Users
- Categories
- Products
- Vehicles
- Product ↔ Vehicle Compatibility
- Warehouses
- Warehouse Locations
- Inventories
- Suppliers
- Purchase Orders
- Stock Transactions
- Stock Adjustments
- Stock Alerts
- Audit Logs

## 2. Current Architecture

```text
HTTP
  ↓
Controller
  ↓
DTO validation
  ↓
Service
  ↓
TypeORM Repository
  ↓
PostgreSQL
```

The current code has CRUD scaffolding for most domains, but the business layer is still thin. There is no complete authentication/authorization layer, and stock-changing operations do not yet enforce inventory invariants transactionally.

## 3. Critical Findings

### P0 — Security / correctness

1. No `/auth/login` backend endpoint exists even though Frontend now expects it.
2. `UserRole` is `ADMIN | STAFF` in Backend, while Frontend expects `ADMIN | WAREHOUSE | SALES`.
3. User creation DTO accepts `passwordHash` directly. Clients should submit a password, while hashing must happen server-side.
4. User CRUD returns the full `User` entity, which includes `passwordHash` and must never be exposed in API responses.
5. Admin controllers have no authentication or role guard.
6. `createdByUserId` / `approvedByUserId` are accepted from request bodies instead of being derived from the authenticated principal where appropriate.
7. Stock transactions currently only write transaction records; they do not update inventory atomically.
8. Stock adjustments calculate `diffQty`, but approval does not implement an inventory mutation workflow.
9. Purchase order receiving is not connected to stock receiving/inventory updates.
10. No explicit database foreign keys exist for most domain relationships in the initial migration.
11. Composite uniqueness/invariants such as one inventory record per product/warehouse/location are not enforced.
12. `poNumber`, `transactionNumber`, and `adjustmentNumber` are client-provided and therefore vulnerable to collisions/business-rule bypass.

### P1 — Domain / API quality

1. Most controllers are unrestricted `admin/*` CRUD endpoints rather than permission-aware APIs.
2. DTO validation exists but numeric transformation and domain-level validation are incomplete.
3. Services do not consistently handle duplicate keys or invalid foreign references with domain-friendly errors.
4. Date fields are stored as `VARCHAR` in the migration rather than database date/timestamp types.
5. Decimal money values are represented as `number`; TypeORM/PostgreSQL decimal handling should be standardized.
6. Audit logs are manually creatable from the API instead of being generated from important mutations.
7. Pagination/filtering/search is absent from list endpoints.
8. Relations are mostly represented only by integer IDs rather than explicit TypeORM relations.

## 4. Target Domain Model

```text
User
 ├── creates PurchaseOrder
 ├── creates StockTransaction
 ├── creates StockAdjustment
 └── produces AuditLog

Category
 └── Product

Product
 ├── Inventory ── Warehouse ── WarehouseLocation
 ├── StockTransactionItem
 ├── StockAdjustmentItem
 ├── PurchaseOrderItem
 ├── StockAlert
 └── ProductVehicleCompatibility ── Vehicle

Supplier
 └── PurchaseOrder ── PurchaseOrderItem ── Product

StockTransaction
 └── StockTransactionItem
       ↓
    Inventory mutation

StockAdjustment
 └── StockAdjustmentItem
       ↓ (approval)
    Inventory mutation
```

## 5. Target Business Rules

### Authentication

- Login accepts username or email plus password.
- Password verification occurs only on Backend.
- Passwords are stored as secure password hashes, never plaintext.
- Login returns an access token and a safe public user representation.
- Protected endpoints require a valid authenticated principal.
- Role authorization is enforced server-side.

### Product

- SKU is unique.
- Barcode is unique when present.
- Category must exist when provided.
- Unit price and stock thresholds cannot be negative.
- Product status controls whether the product can be used in new transactions.

### Inventory

- Inventory quantity cannot become negative unless a future business rule explicitly permits it.
- An inventory record represents one product + warehouse + location combination.
- Reserved quantity cannot exceed quantity.
- Inventory mutations happen inside a database transaction together with their stock transaction record.

### Purchase Order

- PO number is generated/validated server-side.
- Supplier must exist and be usable.
- Items must reference existing active products.
- Ordered quantity must be positive.
- Total amount is calculated by Backend, not trusted from client input.
- Receiving updates received quantities and inventory atomically.

### Stock Transaction

- Transaction number is server-generated.
- Type determines whether inventory increases, decreases, adjusts, or transfers.
- OUT cannot exceed available stock.
- Reference relationships must be valid for the reference type.
- Inventory and transaction history must commit or roll back together.

### Stock Adjustment

- System quantity should be read from inventory rather than trusted from the client.
- Actual quantity is entered by the user.
- Difference is calculated by Backend.
- Approval is a state transition with authorization.
- Approved adjustment creates the corresponding inventory mutation exactly once.

### Audit Log

- Important mutations automatically produce audit events.
- Passwords, tokens and other secrets must never be recorded.
- Audit records should capture actor, action, entity, entity ID and safe metadata.

## 6. Implementation Order

### Phase P0 — Foundation

1. Authentication module
2. JWT/access-token strategy
3. Authenticated principal decorator/guard
4. Role guard
5. Safe user response DTO
6. Password hashing/verification
7. Align backend roles with frontend roles
8. Protect admin endpoints
9. Remove client-controlled identity fields from sensitive mutations
10. Add auth tests and e2e login/authorization tests

### Phase P1 — Master Data

1. Categories
2. Products
3. Suppliers
4. Vehicles
5. Compatibility
6. Warehouses
7. Warehouse Locations
8. Proper relations, constraints and validation
9. Pagination/filtering where required by UI

### Phase P2 — Inventory Core

1. Inventory invariants
2. Stock transaction domain service
3. Atomic IN/OUT/ADJUST behavior
4. Stock movement query API
5. Stock alerts derived from inventory thresholds
6. Audit events

### Phase P3 — Purchase / Adjustment Workflows

1. Purchase Order lifecycle
2. PO item validation
3. Receiving workflow
4. Inventory update from receiving
5. Stock adjustment request/approval workflow
6. Atomicity and duplicate-operation protection

### Phase P4 — Reports / Operational APIs

1. Dashboard metrics
2. Stock reports
3. Movement filters/date ranges
4. Low/over-stock reports
5. Supplier/PO reporting
6. API pagination and sorting

### Phase P5 — Production Hardening

1. E2E coverage for critical workflows
2. Error contract consistency
3. Logging/observability
4. Rate limiting where appropriate
5. Security review
6. Migration verification
7. Production configuration review

## 7. Definition of Done

Backend is considered complete only when:

- [ ] Authentication works against PostgreSQL user records.
- [ ] Passwords are hashed server-side.
- [ ] No API response exposes password hashes.
- [ ] Authorization is enforced server-side.
- [ ] Frontend roles and backend roles agree.
- [ ] Master data CRUD is validated and persisted.
- [ ] Inventory has enforced invariants.
- [ ] IN/OUT/ADJUST mutate inventory atomically.
- [ ] Purchase order receiving updates inventory correctly.
- [ ] Stock adjustment approval mutates inventory exactly once.
- [ ] Audit logs are generated for sensitive mutations.
- [ ] Business identifiers are generated/validated server-side.
- [ ] Database constraints support domain invariants.
- [ ] Critical workflows have unit + e2e tests.
- [ ] Typecheck/build/test pass.
- [ ] Every implementation batch receives a code review of changed files.

## 8. Change Protocol

For every implementation batch:

```text
Explore relevant code
  ↓
Define/confirm domain rule
  ↓
Write tests first where practical
  ↓
Implement smallest coherent change
  ↓
Run targeted tests/typecheck
  ↓
Code review changed files
  ↓
Run broader regression suite
  ↓
Update docs/context
  ↓
Move to next dependency
```

No P1 work should begin while a blocking P0 security/correctness dependency remains unresolved.
