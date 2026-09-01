# StockManagement-KI Backend Glossary

| Term | Meaning |
|---|---|
| User | System account used to authenticate and perform authorized operations. |
| Role | Server-enforced permission category assigned to a User. Current intended application roles are `ADMIN`, `WAREHOUSE`, and `SALES`. |
| Product | A stock-managed motorcycle part identified by SKU and optional barcode. |
| Category | Product classification; categories may have a parent category. |
| Supplier | Organization/person supplying products to the warehouse. |
| Purchase Order (PO) | Document representing products ordered from a supplier. |
| Purchase Order Item | One product line within a purchase order, including ordered quantity and unit cost. |
| Warehouse | A physical stock-holding location. |
| Warehouse Location | A specific zone/shelf/bin inside a warehouse. |
| Inventory | Current quantity state for a product at a warehouse/location. |
| Stock Transaction | Immutable operational record describing stock movement such as IN, OUT, ADJUST or TRANSFER. |
| Stock Transaction Item | Product-level quantity within a stock transaction. |
| Stock Adjustment | Controlled workflow for reconciling system quantity with physically counted quantity. |
| Adjustment Item | Product-level system quantity, actual quantity and calculated difference in an adjustment. |
| Stock Alert | Notification/state indicating a product has crossed a stock threshold. |
| Vehicle | Motorcycle make/model/year/engine information used for compatibility. |
| Compatibility | Relationship between a Product and a Vehicle. |
| Audit Log | Backend-generated record of an important user action and its affected entity. |
| Source of Truth | The authoritative system state. For business data in this project, this is the Backend/database, not Frontend local state. |
| Principal | The authenticated identity attached to the current request. |
| Server-side invariant | A business rule that must remain true regardless of client behavior. |
| Atomic mutation | A multi-step database operation where all related changes commit together or all roll back. |
