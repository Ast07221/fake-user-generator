import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEYS = new Set();

/* demo key */
const DEFAULT_KEY = "demo-key-123";
API_KEYS.add(DEFAULT_KEY);

console.log("API KEY:", DEFAULT_KEY);

/* =========================
   AUTH
========================= */

function auth(req, res, next) {
    const key = req.headers["x-api-key"];

    if (!key || !API_KEYS.has(key)) {
        return res.status(401).json({ error: "Invalid API key" });
    }

    next();
}

/* =========================
   GENERATOR
========================= */

function generateUser() {
    const id = Date.now();

    return {
        id,
        username: "user_" + Math.floor(Math.random() * 9999),
        name: "Demo User",
        email: "demo@mail.com",
        phone: "+1000000000",
        country: "USA",
        city: "NYC",
        address: "Street 1",
        zip: "10001"
    };
}

/* =========================
   ROUTES
========================= */

app.get("/api/generate", auth, (req, res) => {
    res.json(generateUser());
});

app.post("/api/bulk", auth, (req, res) => {
    const count = Math.min(req.body.count || 5, 100);

    const result = [];

    for (let i = 0; i < count; i++) {
        result.push(generateUser());
    }

    res.json(result);
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", version: "v10" });
});

app.listen(10000, () => {
    console.log("server running on 10000");
});
