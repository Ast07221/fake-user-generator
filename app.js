let lastGeneratedData = null;

/* ================= BULK STATE ================= */
let isBulkRunning = false;
let bulkAbort = false;

/* ================= ENGINE ================= */
class UserEngine {

  static rand(arr){
    if(!Array.isArray(arr) || arr.length === 0){
      return "unknown";
    }
    return arr[(Math.random() * arr.length) | 0];
  }

  static getCountry(){
    const keys = Object.keys(window.DATA || {});
    if(!keys.length) return null;
    return window.DATA[this.rand(keys)];
  }

  static makeUser(){
    const c = this.getCountry();
    if(!c) return { error: "NO DATA LOADED" };

    const cities = Object.keys(c.cities || {});
    const city = this.rand(cities);

    const street = this.rand(c.cities?.[city] || ["Main Street"]);

    const first = this.rand(c.first);
    const last = this.rand(c.last);

    const username = (first + last + ((Math.random() * 9999) | 0)).toLowerCase();

    const zip = typeof c.zip === "function"
      ? c.zip()
      : (c.zip || "00000");

    return {
      id: crypto.randomUUID(),
      name: `${first} ${last}`,
      username,
      email: `${username}@${this.rand(c.emails)}`,
      phone: `${this.rand(c.phones)} ${(Math.floor(Math.random() * 9999999))}`,
      country: c.name || "Unknown",
      city,
      street,
      zip,
      address: `${street} ${Math.floor(Math.random() * 200) + 1}, ${city}, ${c.name || ""}`,
      avatar: `https://i.pravatar.cc/150?u=${username}`
    };
  }

  static generateOne(){
    return this.makeUser();
  }

  /* ================= BULK (FIXED STOP) ================= */
  static async generateBulk(count = 100){

    const safeCount = Math.min(count || 100, 10000);

    isBulkRunning = true;
    bulkAbort = false;

    const arr = [];

    for(let i = 0; i < safeCount; i++){

      // 🔥  CHECK STOP FIRST (CRITICAL FIX)
      if(bulkAbort){
        console.warn("⛔ Bulk stopped at:", i);
        break;
      }

      arr.push(this.makeUser());

      // 🔥  force async break EVERY iteration (IMPORTANT FIX)
      await new Promise(requestAnimationFrame);
    }

    isBulkRunning = false;

    return arr;
  }
}

/* ================= SHOW ================= */
function show(data){
  lastGeneratedData = data;

  const el = document.getElementById("userOut");

  el.style.color = "#ffffff";

  el.value = JSON.stringify(data, null, 2);
}

/* ================= ACTIONS ================= */
function genUser(){
  if(isBulkRunning) return;
  show(UserEngine.generateOne());
}

function genBulk(){
  if(isBulkRunning) return;

  const count = parseInt(document.getElementById("bulkCount").value) || 100;

  UserEngine.generateBulk(count).then(data => {
    show(data);
  });
}

function stopBulk(){
  bulkAbort = true;
  console.warn("🛑  STOP clicked");
}

function copyUser(){
  const el = document.getElementById("userOut");
  if(el) navigator.clipboard.writeText(el.value);
}

/* ================= EXPORT JSON ================= */
function exportJSON(){
  if(!lastGeneratedData){
    alert("No data");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(lastGeneratedData, null, 2)],
    {type:"application/json"}
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "users.json";
  a.click();
}

/* ================= EXPORT CSV ================= */
function exportCSV(){
  if(!lastGeneratedData){
    alert("No data");
    return;
  }

  let csv = "id,name,username,email,phone,country,city,street,zip,address\n";

  for(const u of lastGeneratedData){
    csv += `${u.id},${u.name},${u.username},${u.email},${u.phone},${u.country},${u.city},${u.street},${u.zip},${u.address}\n`;
  }

  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "users.csv";
  a.click();
}

/* ================= INIT ================= */
window.addEventListener("DOMContentLoaded", () => {

  if(!window.DATA){
    console.error("❌ DATA not loaded");
    return;
  }

  document.getElementById("genBtn").onclick = genUser;
  document.getElementById("bulkBtn").onclick = genBulk;
  document.getElementById("copyBtn").onclick = copyUser;
});
