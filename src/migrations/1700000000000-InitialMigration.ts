import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // USERS
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR NOT NULL UNIQUE,
        "email" VARCHAR NOT NULL UNIQUE,
        "password_hash" VARCHAR NOT NULL,
        "full_name" VARCHAR NOT NULL,
        "role" VARCHAR NOT NULL DEFAULT 'STAFF',
        "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // CATEGORIES
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL PRIMARY KEY,
        "code" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "parent_id" INT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // PRODUCTS
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL PRIMARY KEY,
        "sku" VARCHAR NOT NULL UNIQUE,
        "barcode" VARCHAR UNIQUE,
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "category_id" INT,
        "unit" VARCHAR NOT NULL,
        "unit_price" NUMERIC(10, 2) NOT NULL DEFAULT 0,
        "min_stock" INT NOT NULL DEFAULT 0,
        "max_stock" INT NOT NULL DEFAULT 0,
        "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // VEHICLES
    await queryRunner.query(`
      CREATE TABLE "vehicles" (
        "id" SERIAL PRIMARY KEY,
        "brand" VARCHAR NOT NULL,
        "model" VARCHAR NOT NULL,
        "year_start" INT NOT NULL,
        "year_end" INT,
        "engine_code" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // PRODUCT VEHICLE COMPATIBILITIES
    await queryRunner.query(`
      CREATE TABLE "product_vehicle_compatibilities" (
        "id" SERIAL PRIMARY KEY,
        "product_id" INT NOT NULL,
        "vehicle_id" INT NOT NULL,
        "notes" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // WAREHOUSES
    await queryRunner.query(`
      CREATE TABLE "warehouses" (
        "id" SERIAL PRIMARY KEY,
        "code" VARCHAR NOT NULL UNIQUE,
        "name" VARCHAR NOT NULL,
        "location_description" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // WAREHOUSE LOCATIONS
    await queryRunner.query(`
      CREATE TABLE "warehouse_locations" (
        "id" SERIAL PRIMARY KEY,
        "warehouse_id" INT NOT NULL,
        "zone" VARCHAR NOT NULL,
        "shelf" VARCHAR NOT NULL,
        "bin" VARCHAR NOT NULL,
        "location_code" VARCHAR NOT NULL UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // INVENTORIES
    await queryRunner.query(`
      CREATE TABLE "inventories" (
        "id" SERIAL PRIMARY KEY,
        "product_id" INT NOT NULL,
        "warehouse_id" INT NOT NULL,
        "location_id" INT NOT NULL,
        "quantity" INT NOT NULL DEFAULT 0,
        "reserved_quantity" INT NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // SUPPLIERS
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" SERIAL PRIMARY KEY,
        "code" VARCHAR NOT NULL UNIQUE,
        "name" VARCHAR NOT NULL,
        "contact_name" VARCHAR,
        "phone" VARCHAR,
        "email" VARCHAR,
        "address" TEXT,
        "tax_id" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // PURCHASE ORDERS & ITEMS
    await queryRunner.query(`
      CREATE TABLE "purchase_orders" (
        "id" SERIAL PRIMARY KEY,
        "po_number" VARCHAR NOT NULL UNIQUE,
        "supplier_id" INT NOT NULL,
        "order_date" VARCHAR,
        "expected_date" VARCHAR,
        "status" VARCHAR NOT NULL DEFAULT 'DRAFT',
        "total_amount" NUMERIC(12, 2) NOT NULL DEFAULT 0,
        "created_by_user_id" INT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "purchase_order_items" (
        "id" SERIAL PRIMARY KEY,
        "purchase_order_id" INT NOT NULL REFERENCES "purchase_orders"("id") ON DELETE CASCADE,
        "product_id" INT NOT NULL,
        "ordered_qty" INT NOT NULL DEFAULT 0,
        "received_qty" INT NOT NULL DEFAULT 0,
        "unit_cost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
        "total_price" NUMERIC(12, 2) NOT NULL DEFAULT 0
      );
    `);

    // STOCK TRANSACTIONS & ITEMS
    await queryRunner.query(`
      CREATE TABLE "stock_transactions" (
        "id" SERIAL PRIMARY KEY,
        "transaction_number" VARCHAR NOT NULL UNIQUE,
        "transaction_type" VARCHAR NOT NULL,
        "reference_type" VARCHAR,
        "reference_id" INT,
        "warehouse_id" INT NOT NULL,
        "created_by_user_id" INT,
        "transaction_date" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "stock_transaction_items" (
        "id" SERIAL PRIMARY KEY,
        "stock_transaction_id" INT NOT NULL REFERENCES "stock_transactions"("id") ON DELETE CASCADE,
        "product_id" INT NOT NULL,
        "location_id" INT,
        "quantity" INT NOT NULL DEFAULT 0,
        "unit_cost" NUMERIC(10, 2) NOT NULL DEFAULT 0
      );
    `);

    // STOCK ADJUSTMENTS & ITEMS
    await queryRunner.query(`
      CREATE TABLE "stock_adjustments" (
        "id" SERIAL PRIMARY KEY,
        "adjustment_number" VARCHAR NOT NULL UNIQUE,
        "reason" TEXT,
        "status" VARCHAR NOT NULL DEFAULT 'PENDING',
        "created_by_user_id" INT,
        "approved_by_user_id" INT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "stock_adjustment_items" (
        "id" SERIAL PRIMARY KEY,
        "stock_adjustment_id" INT NOT NULL REFERENCES "stock_adjustments"("id") ON DELETE CASCADE,
        "product_id" INT NOT NULL,
        "system_qty" INT NOT NULL DEFAULT 0,
        "actual_qty" INT NOT NULL DEFAULT 0,
        "diff_qty" INT NOT NULL DEFAULT 0
      );
    `);

    // STOCK ALERTS
    await queryRunner.query(`
      CREATE TABLE "stock_alerts" (
        "id" SERIAL PRIMARY KEY,
        "product_id" INT NOT NULL,
        "alert_type" VARCHAR NOT NULL,
        "current_qty" INT NOT NULL DEFAULT 0,
        "threshold_qty" INT NOT NULL DEFAULT 0,
        "status" VARCHAR NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // AUDIT LOGS
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT,
        "action" VARCHAR NOT NULL,
        "entity_name" VARCHAR NOT NULL,
        "entity_id" INT,
        "payload" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_logs";`);
    await queryRunner.query(`DROP TABLE "stock_alerts";`);
    await queryRunner.query(`DROP TABLE "stock_adjustment_items";`);
    await queryRunner.query(`DROP TABLE "stock_adjustments";`);
    await queryRunner.query(`DROP TABLE "stock_transaction_items";`);
    await queryRunner.query(`DROP TABLE "stock_transactions";`);
    await queryRunner.query(`DROP TABLE "purchase_order_items";`);
    await queryRunner.query(`DROP TABLE "purchase_orders";`);
    await queryRunner.query(`DROP TABLE "suppliers";`);
    await queryRunner.query(`DROP TABLE "inventories";`);
    await queryRunner.query(`DROP TABLE "warehouse_locations";`);
    await queryRunner.query(`DROP TABLE "warehouses";`);
    await queryRunner.query(`DROP TABLE "product_vehicle_compatibilities";`);
    await queryRunner.query(`DROP TABLE "vehicles";`);
    await queryRunner.query(`DROP TABLE "products";`);
    await queryRunner.query(`DROP TABLE "categories";`);
    await queryRunner.query(`DROP TABLE "users";`);
  }
}
