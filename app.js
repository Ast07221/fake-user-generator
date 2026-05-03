let lastGeneratedData = null;

/* ================= ENGINE ================= */
class UserEngine {
  static rand(arr){
    if(!Array.isArray(arr) || arr.length === 0) return "unknown";
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
      phone: `${this.rand(c.phones)} ${(Math.random() * 9999999) | 0}`,
      country: c.name || "Unknown",
      city,
      street,
      zip,
      address: `${street} ${(Math.random() * 200 | 0) + 1}, ${city}, ${c.name || ""}`,
      avatar: `https://i.pravatar.cc/150?u=${username}`
    };
  }

  static generateOne(){
    return this.makeUser();
  }

  static generateBulk(count = 100){
    const safe = Math.min(count || 100, 10000);
    const arr = [];

    for(let i = 0; i < safe; i++){
      arr.push(this.makeUser());
    }

    return arr;
  }
}

/* ================= TYPEWRITER (FIXED - NO OVERLAP) ================= */
let renderToken = 0;
let isRendering = false;

let activeRenderId = 0;

function typeWriter(text, el, speed = 1){
  const myId = ++activeRenderId;

  el.style.color = "#ffffff";
  el.value = "";

  let i = 0;

  function step(){
    if(myId !== activeRenderId) return;

    if(i >= text.length) return;

    el.value += text[i++];
    setTimeout(step, speed);
  }

  step();
}

/* ================= SHOW ================= */
function show(data){
  lastGeneratedData = data;

  const el = document.getElementById("userOut");

  typeWriter(JSON.stringify(data, null, 2), el, 1);
}
/* ================= ACTIONS ================= */
function genUser(){
  show(UserEngine.generateOne());
}

function genBulk(){
  const count = parseInt(document.getElementById("bulkCount").value) || 100;
  show(UserEngine.generateBulk(count));
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
    { type: "application/json" }
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

  const blob = new Blob([csv], { type: "text/csv" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "users.csv";
  a.click();
}

/* ================= INIT ================= */
function initApp(){
  console.log("DATA LOADED OK");

  const genBtn = document.getElementById("genBtn");
  const bulkBtn = document.getElementById("bulkBtn");
  const copyBtn = document.getElementById("copyBtn");

  if(!genBtn || !bulkBtn || !copyBtn){
    console.error("UI ERROR");
    return;
  }

  genBtn.onclick = genUser;
  bulkBtn.onclick = genBulk;
  copyBtn.onclick = copyUser;
}

/* ================= WAIT DATA ================= */
window.addEventListener("DOMContentLoaded", () => {
  const wait = setInterval(() => {
    if(window.DATA){
      clearInterval(wait);
      initApp();
    }
  }, 50);
});
