-- Create Products Schema for E-Commerce
-- InStyle Hair Boutique - Complete Product Catalog

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  UNIQUE(tenant_id, slug)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  compare_at_price INTEGER, -- Original price for discounts
  cost_price INTEGER, -- For profit tracking
  requires_installation INTEGER DEFAULT 0,
  installation_price INTEGER, -- Installation fee in cents
  stock_quantity INTEGER DEFAULT 0,
  track_inventory INTEGER DEFAULT 0,
  allow_backorder INTEGER DEFAULT 0,
  weight_grams INTEGER,
  length_value TEXT, -- For wigs: "10", "12", etc.
  hair_type TEXT, -- Brazilian, Peruvian, etc.
  texture TEXT, -- Straight, Curly, etc.
  closure_type TEXT, -- 3-way, Regular, HD Lace, etc.
  factory_made INTEGER DEFAULT 0,
  images TEXT, -- JSON array of image URLs
  tags TEXT, -- JSON array of tags
  is_active INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- Shopping Cart Table
CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  session_id TEXT NOT NULL,
  user_id TEXT,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  add_installation INTEGER DEFAULT 0, -- Whether to include installation
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  subtotal INTEGER NOT NULL, -- In cents
  installation_total INTEGER DEFAULT 0,
  shipping_total INTEGER DEFAULT 0,
  tax_total INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method TEXT,
  payment_reference TEXT,
  fulfillment_status TEXT DEFAULT 'unfulfilled', -- unfulfilled, processing, shipped, delivered
  tracking_number TEXT,
  notes TEXT,
  is_laybye INTEGER DEFAULT 0,
  laybye_months INTEGER,
  laybye_paid_amount INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL, -- Price at time of purchase (cents)
  installation_added INTEGER DEFAULT 0,
  installation_price INTEGER,
  subtotal INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_cart_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
