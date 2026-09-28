CREATE DATABASE IF NOT EXISTS orders_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE orders_hub;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  serial_number VARCHAR(80) NOT NULL,
  is_new BOOLEAN NOT NULL DEFAULT TRUE,
  photo VARCHAR(500) NOT NULL DEFAULT '',
  title VARCHAR(160) NOT NULL,
  type VARCHAR(80) NOT NULL,
  specification VARCHAR(500) NOT NULL DEFAULT '',
  guarantee_start DATETIME NOT NULL,
  guarantee_end DATETIME NOT NULL,
  order_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_products_type (type),
  INDEX idx_products_order_id (order_id),
  CONSTRAINT fk_products_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prices (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  symbol VARCHAR(8) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_currency (product_id, symbol),
  INDEX idx_prices_product_id (product_id),
  CONSTRAINT fk_prices_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
