let runId = 0;

/* ================= RANDOM ================= */
function rand(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

/* ================= AI PRO MAX TYPEWRITER ================= */
let typingQueue = false;

function typeWriter(text, el){
  if(typingQueue) return;
  typingQueue = true;

  el.value = "";

  let i = 0;

  function step(){
    if(i < text.length){

      el.value += text.charAt(i);

      // 🔥  human-like pauses
      let delay = 6;

      const char = text[i];

      if(char === "," || char === "{") delay = 40;
      if(char === "\n") delay = 60;
      if(char === ":") delay = 25;
      if(Math.random() < 0.02) delay = 120;

      i++;
      setTimeout(step, delay);

    } else {
      typingQueue = false;
    }
  }

  step();
}

/* ================= USER ENGINE ================= */
function makeUser(){
  const country = rand(countries);
  const f = rand(firstNames);
  const l = rand(lastNames);

  const username = (f + l + Math.floor(Math.random()*9999)).toLowerCase();

  return {
    name: `${f} ${l}`,
    username,
    email: `${username}@${rand(emails)}`,
    phone: country.p + Math.floor(1000000000 + Math.random()*9000000000),
    country: country.c
  };
}

/* ================= SHOW ================= */
function show(data){
  typeWriter(JSON.stringify(data, null, 2), document.getElementById("userOut"));
}

/* ================= SINGLE ================= */
function genUser(){
  show(makeUser());
}

/* ================= BULK ================= */
function genBulk(){
  const count = parseInt(document.getElementById("bulkCount").value) || 50;

  const arr = [];
  for(let i = 0; i < count; i++){
    arr.push(makeUser());
  }

  typeWriter(JSON.stringify(arr, null, 2), document.getElementById("userOut"));
}

/* ================= COPY ================= */
function copyUser(){
  navigator.clipboard.writeText(
    document.getElementById("userOut").value
  );
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

  let csv = "name,username,email,phone,country\n";

  data.forEach(u=>{
    csv += `${u.name},${u.username},${u.email},${u.phone},${u.country}\n`;
  });

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
