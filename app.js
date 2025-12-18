const API = "http://localhost:5000";
let items = [];

async function init() {
  loadClients();
  loadItems();
  loadDashboard();
}

function show(id){
  document.querySelectorAll(".content > div")
    .forEach(d => d.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

async function loadClients(){
  const r = await fetch(API+"/clients");
  const data = await r.json();
  clientSelect.innerHTML="";
  data.forEach(c=>{
    clientSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

async function loadItems(){
  const r = await fetch(API+"/items");
  items = await r.json();
  addItem();
}

function addItem(){
  const t = document.getElementById("itemsTable");
  const i = items[0];
  t.innerHTML += `
    <tr>
      <td>${i.name}</td>
      <td><input value="1"></td>
    </tr>`;
}

async function saveInvoice(){
  const payload = {
    client_id: clientSelect.value,
    invoice_date: new Date().toISOString().slice(0,10),
    subtotal: 50000,
    tax: 9000,
    grand_total: 59000,
    items: [{item_id:1, qty:1}]
  };

  await fetch(API+"/invoices", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  });

  alert("Invoice Saved");
  loadDashboard();
}

async function loadDashboard(){
  const r = await fetch(API+"/invoices");
  const data = await r.json();
  dashboard.innerHTML = "<h2>Dashboard</h2>";
  data.forEach(i=>{
    dashboard.innerHTML += `<p>${i.invoice_number} - ₹${i.grand_total}</p>`;
  });
}

function printInvoice(){
  window.print();
}
