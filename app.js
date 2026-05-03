let runId = 0;

/* ================= FAST RNG ================= */
function rand(arr){
  return arr[(Math.random() * arr.length) | 0];
}

/* ================= PERFORMANCE SAFE TYPEWRITER ================= */
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

    if(c === "\n") delay = 10;
    else if(c === "," || c === "{") delay = 5;
    else if(c === ":") delay = 4;
    else if(Math.random() < 0.008) delay = 25;

    setTimeout(step, delay);
  }

  step();
}

/* ================= ENTERPRISE COUNTRY ENGINE ================= */
const DATA = {
  US: {
    name: "United States",
    phones: ["+1 (212)", "+1 (305)", "+1 (415)", "+1 (213)", "+1 (312)"],
    zips: () => (10000 + (Math.random() * 89999) | 0),
    cities: ["New York","Los Angeles","Chicago","Houston","Miami","Dallas","Seattle","Boston"],
    emails: ["gmail.com","outlook.com","yahoo.com","icloud.com"],
    first: [
      "James","John","Robert","Michael","William","David","Richard","Joseph","Thomas","Charles",
      "Emma","Olivia","Ava","Sophia","Isabella","Mia","Amelia","Harper","Evelyn","Abigail"
    ],
    last: [
      "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
      "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin"
    ]
  },

  DE: {
    name: "Germany",
    phones: ["+49 30", "+49 40", "+49 89", "+49 69", "+49 221"],
    zips: () => (10000 + (Math.random() * 89999) | 0),
    cities: ["Berlin","Hamburg","Munich","Cologne","Frankfurt","Stuttgart","Düsseldorf"],
    emails: ["gmail.com","gmx.de","web.de","outlook.com"],
    first: [
      "Max","Paul","Leon","Lukas","Finn","Noah","Elias","Jonas","Ben","Felix",
      "Emma","Hannah","Sofia","Mia","Emilia","Lina","Marie","Lea","Lena","Anna"
    ],
    last: [
      "Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Hoffmann","Schäfer",
      "Koch","Bauer","Richter","Klein","Wolf","Schröder","Neumann","Schwarz","Zimmermann","Braun"
    ]
  },

  JP: {
    name: "Japan",
    phones: ["+81 3", "+81 6", "+81 45", "+81 52", "+81 92"],
    zips: () => (1000000 + (Math.random() * 8999999) | 0),
    cities: ["Tokyo","Osaka","Kyoto","Nagoya","Yokohama","Sapporo","Fukuoka"],
    emails: ["gmail.com","yahoo.co.jp","icloud.com"],
    first: [
      "Haruto","Yuto","Sota","Yuki","Ren","Hiro","Daiki","Kaito","Riku","Shota",
      "Aoi","Hina","Yui","Sakura","Mio","Rio","Mei","Rin","Nana","Haruka"
    ],
    last: [
      "Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato",
      "Yoshida","Yamada","Sasaki","Yamaguchi","Matsumoto","Inoue","Kimura","Hayashi","Shimizu","Saito"
    ]
  },

  NL: {
    name: "Netherlands",
    phones: ["+31 20", "+31 10", "+31 70", "+31 40", "+31 30"],
    zips: () => `${1000 + (Math.random()*8999|0)} AB`,
    cities: ["Amsterdam","Rotterdam","Utrecht","Eindhoven","Haarlem","Groningen"],
    emails: ["gmail.com","outlook.com","ziggo.nl"],
    first: [
      "Daan","Lars","Sem","Finn","Bram","Tijs","Milan","Jesse","Noah","Lucas",
      "Emma","Sophie","Julia","Mila","Tess","Lotte","Nora","Eva","Sara","Anna"
    ],
    last: [
      "de Jong","Jansen","de Vries","van den Berg","Bakker","Visser","Smit","Meijer","de Boer","Mulder",
      "van Dijk","Dekker","de Groot","Kok","Jacobs","Vermeulen","Hendriks","Bos","de Wit","van Leeuwen"
    ]
  }
};

/* ================= COUNTRY PICK ================= */
function getCountry(){
  const keys = Object.keys(DATA);
  return DATA[keys[(Math.random() * keys.length) | 0]];
}

/* ================= USER ENGINE ================= */
function makeUser(){
  const c = getCountry();

  const f = rand(c.first);
  const l = rand(c.last);
  const username = (f + l + ((Math.random() * 9999) | 0)).toLowerCase();

  const city = rand(c.cities);

  return {
    name: `${f} ${l}`,
    username,
    email: `${username}@${rand(c.emails)}`,
    phone: rand(c.phones) + " " + ((Math.random() * 9999999) | 0),
    country: c.name,
    city,
    zip: typeof c.zips === "function" ? c.zips() : c.zips,
    address: `${city}, ${c.name}`,
    avatar: `https://i.pravatar.cc/150?u=${username}`
  };
}

/* ================= SAFE SHOW ================= */
function show(data){
  runId++;
  typeWriter(
    JSON.stringify(data, null, 2),
    document.getElementById("userOut"),
    2,
    runId
  );
}

/* ================= SINGLE ================= */
function genUser(){
  show(makeUser());
}

/* ================= BULK (OPTIMIZED) ================= */
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

/* ================= EXPORT ================= */
function exportJSON(){
  const data = document.getElementById("userOut").value;
  const blob = new Blob([data], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "users.json";
  a.click();
}

function exportCSV(){
  const data = JSON.parse(document.getElementById("userOut").value);

  let csv = "name,username,email,phone,country,city,zip,address\n";

  for(let u of data){
    csv += `${u.name},${u.username},${u.email},${u.phone},${u.country},${u.city},${u.zip},${u.address}\n`;
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
