const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   CONFIG
========================= */
const PORT = process.env.PORT || 10000;
const API_KEY = process.env.API_KEY || "dev-key";

/* =========================
   DATA
========================= */
const countries = {
    USA: ["New York", "Los Angeles", "Chicago"],
    Germany: ["Berlin", "Munich"],
    France: ["Paris", "Lyon"],
    UK: ["London", "Manchester"]
};

const names = ["John Smith","Emma Brown","Liam Johnson","Olivia Davis"];

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
        version: "stable"
    };
}

/* =========================
   AUTH
========================= */
function auth(req, res, next) {
    const key = req.headers["x-api-key"];
    if (key !== API_KEY) {
        return res.status(401).json({ error: "Invalid API key" });
    }
    next();
}

/* =========================
   ROUTES
========================= */

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/generate", auth, (req, res) => {
    res.json(generateUser());
});

app.post("/api/bulk", auth, (req, res) => {
    const count = Math.min(req.body.count || 5, 100);
    const arr = [];

    for (let i = 0; i < count; i++) {
        arr.push(generateUser());
    }

    res.json(arr);
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
    console.log("SaaS backend running on port", PORT);
});
