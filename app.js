/* ================= GLOBAL STATE ================= */
let runId = 0;

/* ================= ENGINE CLASS ================= */
class UserEngine {

  static rand(arr){
    return arr[(Math.random() * arr.length) | 0];
  }

  static getCountry(){
    const keys = Object.keys(DATA);
    return DATA[this.rand(keys)];
  }

  static makeUser(){
    const c = this.getCountry();

    const city = this.rand(Object.keys(c.cities));
    const street = this.rand(c.cities[city]);

    const first = this.rand(c.first);
    const last = this.rand(c.last);

    const username = (first + last + ((Math.random() * 9999) | 0)).toLowerCase();

    const zip = typeof c.zip === "function" ? c.zip() : c.zip;

    return {
      id: crypto.randomUUID(),

      name: `${first} ${last}`,
      username,
      email: `${username}@${this.rand(c.emails)}`,
      phone: `${this.rand(c.phones)} ${(Math.random() * 9999999) | 0}`,

      country: c.name,
      city,
      street,
      zip,

      address: `${street} ${(Math.random() * 200 | 0) + 1}, ${city}, ${c.name}`,

      avatar: `https://i.pravatar.cc/150?u=${username}`
    };
  }

  static generateOne(){
    return this.makeUser();
  }

  static generateBulk(count = 100){
    const safeCount = Math.min(count || 100, 10000);

    const arr = new Array(safeCount);
    for(let i = 0; i < safeCount; i++){
      arr[i] = this.makeUser();
    }
    return arr;
  }
}

/* ================= TYPEWRITER ================= */
function typeWriter(text, el, speed = 1){
  el.value = "";
  let i = 0;

  function step(){
    if(i >= text.length) return;
    el.value += text[i++];
    setTimeout(step, speed);
  }

  step();
}

/* ================= SHOW ================= */
function show(data){
  runId++;
  typeWriter(
    JSON.stringify(data, null, 2),
    document.getElementById("userOut"),
    1
  );
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
  navigator.clipboard.writeText(el.value);
}

/* ================= EXPORT JSON ================= */
function exportJSON(){
  const data = document.getElementById("userOut").value;

  const blob = new Blob([data], {type:"application/json"});
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "users.json";
  a.click();
}

/* ================= EXPORT CSV ================= */
function exportCSV(){
  const data = JSON.parse(document.getElementById("userOut").value);

  let csv = "id,name,username,email,phone,country,city,street,zip,address\n";

  for(const u of data){
    csv += `${u.id},${u.name},${u.username},${u.email},${u.phone},${u.country},${u.city},${u.street},${u.zip},${u.address}\n`;
  }

  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "users.csv";
  a.click();
}

/* ================= EVENTS ================= */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("genBtn").onclick = genUser;
  document.getElementById("bulkBtn").onclick = genBulk;
  document.getElementById("copyBtn").onclick = copyUser;
});
