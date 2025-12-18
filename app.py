from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db
from datetime import datetime

app = Flask(__name__)
CORS(app)

def generate_invoice_no(cur):
    cur.execute("SELECT COUNT(*) FROM invoices")
    return f"INV-{datetime.now().year}-{cur.fetchone()[0]+1:04d}"

@app.route("/clients")
def clients():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM clients")
    return jsonify(cur.fetchall())

@app.route("/items")
def items():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM items")
    return jsonify(cur.fetchall())

@app.route("/invoices", methods=["GET", "POST"])
def invoices():
    db = get_db()
    cur = db.cursor(dictionary=True)

    if request.method == "POST":
        data = request.json
        invoice_no = generate_invoice_no(cur)

        cur.execute("""
          INSERT INTO invoices
          (invoice_number, client_id, invoice_date, subtotal, tax, grand_total, pdf_generated)
          VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            invoice_no,
            data["client_id"],
            data["invoice_date"],
            data["subtotal"],
            data["tax"],
            data["grand_total"],
            True
        ))

        invoice_id = cur.lastrowid

        for it in data["items"]:
            cur.execute("""
              INSERT INTO invoice_items (invoice_id, item_id, quantity)
              VALUES (%s,%s,%s)
            """, (invoice_id, it["item_id"], it["qty"]))

        db.commit()
        return jsonify({"invoice_number": invoice_no})

    cur.execute("""
      SELECT i.invoice_number, c.name AS client, i.grand_total
      FROM invoices i JOIN clients c ON i.client_id=c.id
      ORDER BY i.id DESC
    """)
    return jsonify(cur.fetchall())

if __name__ == "__main__":
    app.run(debug=True)
