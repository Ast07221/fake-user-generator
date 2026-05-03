let runId = 0;

/* ================= FAST RANDOM ================= */
function rand(arr){
  return arr[(Math.random() * arr.length) | 0];
}

/* ================= COUNTRY PICK ================= */
function getCountry(){
  const keys = Object.keys(DATA);
  return DATA[rand(keys)];
}

/* ================= USER ENGINE ================= */
function makeUser(){
  const c = getCountry();

  const city = rand(Object.keys(c.cities));
  const street = rand(c.cities[city]);

  const f = rand(c.first);
  const l = rand(c.last);

  const username = (f + l + ((Math.random() * 9999) | 0)).toLowerCase();

  return {
    name: `${f} ${l}`,
    username,
    email: `${username}@${rand(c.emails)}`,
    phone: rand(c.phones) + " " + ((Math.random() * 9999999) | 0),

    country: c.name,
    city,
    street,
    zip: typeof c.zip === "function" ? c.zip() : c.zip,

    address: `${street} ${(Math.random()*200|0)+1}, ${city}, ${c.name}`,

    avatar: `https://i.pravatar.cc/150?u=${username}`
  };
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
  typeWriter(JSON.stringify(data, null, 2), document.getElementById("userOut"), 1);
}

/* ================= SINGLE ================= */
function genUser(){
  show(makeUser());
}

/* ================= BULK (NO LAG VERSION) ================= */
function genBulk(){
  const count = Math.min(parseInt(document.getElementById("bulkCount").value) || 50, 5000);

  const arr = new Array(count);
  for(let i = 0; i < count; i++){
    arr[i] = makeUser();
  }

  show(arr);
}

/* ================= COPY ================= */
function copyUser(){
  navigator.clipboard.writeText(document.getElementById("userOut").value);
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

  let csv = "name,username,email,phone,country,city,street,zip,address\n";

  for(const u of data){
    csv += `${u.name},${u.username},${u.email},${u.phone},${u.country},${u.city},${u.street},${u.zip},${u.address}\n`;
  }

  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "users.csv";
  a.click();
}

/* ================= EVENTS ================= */
document.getElementById("genBtn").onclick = genUser;
document.getElementById("bulkBtn").onclick = genBulk;
document.getElementById("copyBtn").onclick = copyUser;
