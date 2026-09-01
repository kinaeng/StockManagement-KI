# ADR-0001: Backend Source of Truth and Domain Boundaries

## Status

Accepted for the backend completion plan.

## Context

The Frontend currently contains local/mock business data in composables. The Backend already contains PostgreSQL + TypeORM entities and CRUD modules for the core inventory domains.

The application needs a single authoritative source for business state, especially inventory and stock movements. Client-side values such as stock quantity, totals, transaction numbers and actor IDs cannot be trusted as authoritative business state.

## Decision

1. PostgreSQL is the current database source of truth because the existing Backend `AppModule`, `data-source.ts`, migration and `.env.example` configure PostgreSQL.
2. NestJS + TypeORM is the application-layer source of truth for business rules.
3. Frontend state is presentation/cache state only; it must not be authoritative for inventory, users, products, purchase orders or transactions.
4. Stock-changing operations must be implemented as domain workflows rather than generic CRUD-only operations.
5. Sensitive identity information is derived from the authenticated principal rather than accepted from client input.
6. Business-generated identifiers are generated/validated server-side.
7. Database constraints are part of domain correctness and should enforce uniqueness/relationship invariants where possible.
8. Audit logging belongs to backend mutation workflows, not to arbitrary client-created audit records.

## Consequences

### Positive

- Multiple frontend screens can share one source of truth.
- Inventory mutations can be made atomic.
- Security-sensitive fields are controlled server-side.
- Database and service-layer invariants can be tested independently of UI.

### Trade-offs

- Backend workflows become more sophisticated than the existing CRUD scaffolding.
- Some current Frontend mock contracts will need adaptation to real API response shapes.
- Database migrations must be treated as part of feature work.

## Rejected Alternatives

### Keep business state in Frontend composables

Rejected because it permits divergent state between pages and cannot provide durable transactional inventory behavior.

### Use generic CRUD for stock operations

Rejected because stock movement affects inventory and must enforce business invariants atomically.

### Trust client-provided totals/actor IDs/transaction numbers

Rejected because these values are business/security sensitive and can be manipulated by clients.
