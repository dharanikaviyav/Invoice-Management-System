const API = "http://localhost:5000";
let items = [];
let selectedItems = [];

async function init() {
  loadClients();
  loadItems();
  loadDashboard();
}

function show(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

async function loadClients() {
  const r = await fetch(API+"/clients");
  const data = await r.json();
  clientSelect.innerHTML="";
  data.forEach(c => {
    clientSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

async function loadItems() {
  const r = await fetch(API+"/items");
  items = await r.json();
  addItem();
}

function addItem() {
  const i = items[0];
  selectedItems.push({ item_id: i.id, qty: 1, price: i.price, gst: i.gst_percent });
  renderItems();
}

function renderItems() {
  itemsTable.innerHTML = `
    <tr><th>Item</th><th>Qty</th><th>Price</th><th>GST</th><th>Total</th></tr>`;
  let subtotal = 0, tax = 0;

  selectedItems.forEach(it => {
    const rowTotal = it.qty * it.price;
    const rowTax = rowTotal * it.gst / 100;
    subtotal += rowTotal;
    tax += rowTax;

    itemsTable.innerHTML += `
      <tr>
        <td>${items.find(i=>i.id===it.item_id).name}</td>
        <td>${it.qty}</td>
        <td>₹${rowTotal}</td>
        <td>₹${rowTax}</td>
        <td>₹${rowTotal+rowTax}</td>
      </tr>`;
  });

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("tax").innerText = tax;
  document.getElementById("grand").innerText = subtotal + tax;
}

async function saveInvoice() {
  await fetch(API+"/invoices", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      client_id: clientSelect.value,
      invoice_date: new Date().toISOString().slice(0,10),
      subtotal: Number(subtotal.innerText),
      tax: Number(tax.innerText),
      grand_total: Number(grand.innerText),
      items: selectedItems
    })
  });
  alert("Invoice saved");
  loadDashboard();
}

async function loadDashboard() {
  const r = await fetch(API+"/invoices");
  const data = await r.json();
  dashboard.innerHTML = "<h2>Dashboard</h2>";
  data.forEach(i => {
    dashboard.innerHTML += `<p>${i.invoice_number} - ${i.client} - ₹${i.grand_total}</p>`;
  });
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Invoice", 14, 20);
  doc.text("Grand Total: ₹"+grand.innerText, 14, 40);
  doc.save("invoice.pdf");
}

function printInvoice() {
  window.print();
}
