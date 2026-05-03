let runId = 0;

/* ================= FAST RANDOM ================= */
function rand(arr){
  return arr[(Math.random() * arr.length) | 0];
}

/* ================= SAFE TYPEWRITER ================= */
function typeWriter(text, el, speed = 2, id){
  const currentId = id ?? ++runId;
  el.value = "";

  let i = 0;

  function step(){
    if(currentId !== runId) return;
    if(i >= text.length) return;

    el.value += text[i++];

    const c = text[i - 1];
    let delay = speed;

    if(c === "\n") delay = 8;
    else if(c === "," || c === "{") delay = 4;
    else if(c === ":") delay = 3;
    else if(Math.random() < 0.01) delay = 20;

    setTimeout(step, delay);
  }

  step();
}

/* ================= DATA ================= */
const DATA = {
  US: {
    name: "United States",
    phones: ["+1 (212)", "+1 (305)", "+1 (415)", "+1 (213)", "+1 (312)"],
    cities: {
      "New York": ["5th Avenue","Broadway","Wall Street"],
      "Los Angeles": ["Sunset Blvd","Hollywood Blvd","Venice Blvd"],
      "Chicago": ["Lake Shore Dr","Michigan Ave"],
      "Miami": ["Ocean Dr","Brickell Ave"]
    },
    zip: () => (10000 + (Math.random()*89999|0)),
    emails: ["gmail.com","outlook.com","yahoo.com"],
    first: ["James","John","Michael","David","Robert","Emma","Olivia","Ava","Sophia","Isabella"],
    last: ["Smith","Johnson","Brown","Williams","Jones","Miller","Davis","Wilson","Moore","Taylor"]
  },

  DE: {
    name: "Germany",
    phones: ["+49 30", "+49 40", "+49 89"],
    cities: {
      "Berlin": ["Unter den Linden","Alexanderplatz","Friedrichstrasse"],
      "Munich": ["Marienplatz","Leopoldstrasse"],
      "Hamburg": ["Reeperbahn","Jungfernstieg"]
    },
    zip: () => (10000 + (Math.random()*89999|0)),
    emails: ["gmail.com","gmx.de","web.de"],
    first: ["Max","Paul","Leon","Lukas","Finn","Emma","Hannah","Sofia","Marie","Lena"],
    last: ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Hoffmann","Schäfer"]
  },

  NL: {
    name: "Netherlands",
    phones: ["+31 20", "+31 10", "+31 70"],
    cities: {
      "Amsterdam": ["Damrak","Leidseplein","Herengracht"],
      "Rotterdam": ["Coolsingel","Weena"],
      "Utrecht": ["Oudegracht","Neude"]
    },
    zip: () => `${1000 + (Math.random()*8999|0)} AB`,
    emails: ["gmail.com","outlook.com","ziggo.nl"],
    first: ["Daan","Lars","Finn","Milan","Jesse","Emma","Sophie","Noor","Eva","Lotte"],
    last: ["de Jong","Jansen","de Vries","Bakker","Visser","Smit","Meijer","de Boer","Mulder","van Dijk"]
  },

  JP: {
    name: "Japan",
    phones: ["+81 3", "+81 6", "+81 45"],
    cities: {
      "Tokyo": ["Shibuya","Shinjuku","Ginza"],
      "Osaka": ["Namba","Umeda"],
      "Kyoto": ["Gion","Arashiyama"]
    },
    zip: () => (1000000 + (Math.random()*8999999|0)),
    emails: ["gmail.com","yahoo.co.jp","icloud.com"],
    first: ["Haruto","Yuto","Sota","Yuki","Ren","Hiro","Kaito","Riku","Aoi","Hina"],
    last: ["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato"]
  }
};

/* ================= PICK COUNTRY ================= */
function getCountry(){
  const keys = Object.keys(DATA);
  return DATA[keys[(Math.random() * keys.length) | 0]];
}

/* ================= USER ================= */
function makeUser(){
  const c = getCountry();

  const city = rand(Object.keys(c.cities));
  const street = rand(c.cities[city]);

  const f = rand(c.first);
  const l = rand(c.last);

  const username = (f + l + ((Math.random()*9999)|0)).toLowerCase();

  const house = (Math.random()*200|0) + 1;

  return {
    name: `${f} ${l}`,
    username,
    email: `${username}@${rand(c.emails)}`,
    phone: rand(c.phones) + " " + ((Math.random()*9999999)|0),

    country: c.name,
    city,
    street,
    house,
    zip: typeof c.zip === "function" ? c.zip() : c.zip,

    address: `${street} ${house}, ${city}, ${c.name}`,

    avatar: `https://i.pravatar.cc/150?u=${username}`
  };
}

/* ================= SHOW ================= */
function show(data){
  runId++;
  typeWriter(JSON.stringify(data, null, 2), document.getElementById("userOut"), 2, runId);
}

/* ================= SINGLE ================= */
function genUser(){
  show(makeUser());
}

/* ================= BULK ================= */
function genBulk(){
  const count = Math.min(parseInt(document.getElementById("bulkCount").value) || 50, 2000);

  const arr = new Array(count);
  for(let i = 0; i < count; i++){
    arr[i] = makeUser();
  }

  runId++;
  typeWriter(JSON.stringify(arr, null, 2), document.getElementById("userOut"), 0, runId);
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

  let csv = "name,username,email,phone,country,city,street,house,zip,address\n";

  for(let u of data){
    csv += `${u.name},${u.username},${u.email},${u.phone},${u.country},${u.city},${u.street},${u.house},${u.zip},${u.address}\n`;
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
