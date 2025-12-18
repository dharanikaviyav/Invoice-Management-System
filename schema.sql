CREATE DATABASE IF NOT EXISTS invoice_db;
USE invoice_db;

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE,
    customer_name VARCHAR(100),
    customer_address TEXT,
    invoice_date DATE,
    due_date DATE,
    status VARCHAR(20),
    subtotal DECIMAL(10,2),
    cgst DECIMAL(10,2),
    sgst DECIMAL(10,2),
    igst DECIMAL(10,2),
    grand_total DECIMAL(10,2)
);

CREATE TABLE invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    description VARCHAR(255),
    quantity INT,
    unit_price DECIMAL(10,2),
    tax_rate DECIMAL(5,2),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
