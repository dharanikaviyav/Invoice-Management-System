CREATE DATABASE IF NOT EXISTS invoice_db;
USE invoice_db;

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  gst_percent DECIMAL(5,2)
);

CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(20) UNIQUE,
  client_id INT,
  invoice_date DATE,
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  grand_total DECIMAL(10,2),
  pdf_generated BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT,
  item_id INT,
  quantity INT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

/* Seed clients */
INSERT INTO clients (name) VALUES
('TCS'), ('Infosys'), ('Wipro'), ('Reliance'), ('Local Store');

/* Seed items */
INSERT INTO items (name, price, gst_percent) VALUES
('Laptop', 50000, 18),
('Printer', 12000, 18),
('Stationery', 500, 5),
('Consulting Service', 20000, 18);
