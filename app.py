from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db
from datetime import datetime

app = Flask(__name__)
CORS(app)

def generate_invoice_number(cursor):
    cursor.execute("SELECT COUNT(*) FROM invoices")
    count = cursor.fetchone()[0] + 1
    return f"INV-{datetime.now().year}-{str(count).zfill(4)}"

@app.route("/api/invoices", methods=["POST"])
def create_invoice():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    invoice_number = generate_invoice_number(cursor)

    cursor.execute("""
        INSERT INTO invoices
        (invoice_number, customer_name, customer_address, invoice_date, due_date,
         status, subtotal, cgst, sgst, igst, grand_total)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        invoice_number,
        data["customerName"],
        data["customerAddress"],
        data["invoiceDate"],
        data["dueDate"],
        data["status"],
        data["subtotal"],
        data["cgst"],
        data["sgst"],
        data["igst"],
        data["grandTotal"]
    ))

    invoice_id = cursor.lastrowid

    for item in data["items"]:
        cursor.execute("""
            INSERT INTO invoice_items
            (invoice_id, description, quantity, unit_price, tax_rate)
            VALUES (%s,%s,%s,%s,%s)
        """, (
            invoice_id,
            item["description"],
            item["quantity"],
            item["unitPrice"],
            item["taxRate"]
        ))

    db.commit()
    return jsonify({"message": "Invoice Created", "invoiceNumber": invoice_number}), 201

@app.route("/api/invoices", methods=["GET"])
def get_invoices():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM invoices ORDER BY id DESC")
    return jsonify(cursor.fetchall())

if __name__ == "__main__":
    app.run(debug=True)
