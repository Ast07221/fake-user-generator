import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import Redis from "ioredis";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   DB (Postgres)
========================= */

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

/* =========================
   REDIS
========================= */

const redis = new Redis(process.env.REDIS_URL);

/* =========================
   GENERATOR CORE
========================= */

function generateUser() {
    return {
        id: uuid(),
        username: "user_" + Math.floor(Math.random() * 9999),
        name: "Demo User",
        email: "demo@mail.com",
        country: "USA",
        city: "NYC",
        createdAt: Date.now()
    };
}

/* =========================
   AUTH MIDDLEWARE
========================= */

async function auth(req, res, next) {
    const key = req.headers["x-api-key"];

    if (!key) return res.status(401).json({ error: "No API key" });

    const cached = await redis.get(`apikey:${key}`);
    if (!cached) {
        const result = await db.query(
            "SELECT * FROM users WHERE api_key=$1",
            [key]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid key" });
        }

        await redis.set(`apikey:${key}`, JSON.stringify(result.rows[0]), "EX", 300);
        req.user = result.rows[0];
    } else {
        req.user = JSON.parse(cached);
    }

    next();
}

/* =========================
   RATE LIMIT (Redis)
========================= */

async function rateLimit(req, res, next) {
    const key = `rate:${req.user.api_key}`;

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, 60);
    }

    if (count > 100) {
        return res.status(429).json({ error: "Rate limit exceeded" });
    }

    next();
}

/* =========================
   API
========================= */

app.get("/api/generate", auth, rateLimit, async (req, res) => {
    const data = generateUser();

    await db.query(
        "INSERT INTO usage_logs(user_id, endpoint, created_at) VALUES ($1,$2,NOW())",
        [req.user.id, "/api/generate"]
    );

    res.json(data);
});

app.post("/api/bulk", auth, rateLimit, async (req, res) => {
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
    res.json({
        status: "ok",
        version: "v10 production"
    });
});

/* =========================
   START
========================= */

app.listen(10000, () => {
    console.log("v10 production SaaS running");
});
