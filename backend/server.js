import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   CORE ENGINE
========================= */

const countries = {
  USA: ["New York", "Los Angeles", "Chicago"],
  Germany: ["Berlin", "Munich"],
  France: ["Paris", "Lyon"]
};

const names = ["John Smith", "Emma Brown", "Liam Johnson"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUser() {
  const country = pick(Object.keys(countries));
  const city = pick(countries[country]);
  const name = pick(names);

  const username = name.toLowerCase().replace(" ", "") + Math.floor(Math.random()*999);

  return {
    id: Date.now(),
    username,
    name,
    email: username + "@mail.com",
    phone: "+" + (Math.floor(Math.random()*9000000000)+1000000000),
    country,
    city,
    address: "Street " + Math.floor(Math.random()*300),
    zip: Math.floor(10000 + Math.random()*90000),
    version: "v7"
  };
}

/* =========================
   API LAYER
========================= */

app.get("/api/generate", (req, res) => {
  const type = req.query.type || "user";

  if (type === "user") {
    return res.json(generateUser());
  }

  return res.status(400).json({ error: "unknown generator type" });
});

app.post("/api/bulk", (req, res) => {
  const count = Math.min(req.body.count || 5, 100);

  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(generateUser());
  }

  res.json(result);
});

/* =========================
   HEALTH
========================= */

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v7" });
});

app.listen(10000, () => {
  console.log("v7 SaaS platform running on 10000");
});
