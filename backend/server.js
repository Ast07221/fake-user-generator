const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SIMPLE DATA ENGINE
========================= */

const countries = {
  USA: ["New York", "Los Angeles", "Chicago", "Miami"],
  Germany: ["Berlin", "Munich", "Hamburg"],
  France: ["Paris", "Lyon", "Marseille"],
  UK: ["London", "Manchester", "Liverpool"],
  Italy: ["Rome", "Milan", "Naples"],
  Spain: ["Madrid", "Barcelona", "Valencia"]
};

const names = [
  "John Smith",
  "Emma Brown",
  "Liam Johnson",
  "Olivia Davis",
  "Noah Wilson",
  "Ava Martinez"
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function num(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/* =========================
   USER GENERATOR
========================= */

function createUser() {
  const country = rand(Object.keys(countries));
  const city = rand(countries[country]);

  const name = rand(names);
  const username =
    name.toLowerCase().replace(" ", "") + num(100, 9999);

  return {
    username,
    name,
    email: username + "@mail.com",
    phone: "+" + num(1000000000, 9999999999),
    country,
    city,
    address: "Street " + num(1, 300),
    zip: num(10000, 99999)
  };
}

/* =========================
   API ROUTES
========================= */

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// single user
app.get("/api/user", (req, res) => {
  res.json(createUser());
});

// bulk users
app.get("/api/bulk", (req, res) => {
  const count = Math.min(100, parseInt(req.query.count || 5));

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(createUser());
  }

  res.json(result);
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SaaS API running on port " + PORT);
});
