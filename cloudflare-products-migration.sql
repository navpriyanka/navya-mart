-- Run this once in Cloudflare D1 Console for navya-mart-db.
-- This adds one field to the EXISTING products table; it creates no new table.
ALTER TABLE products ADD COLUMN purchase_cost REAL NOT NULL DEFAULT 0;
