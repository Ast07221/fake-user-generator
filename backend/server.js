import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   "DATABASE"
========================= */

const users = new Map();        // email -> user
const sessions = new Map();     // token -> email

/* =========================
   CORE DATA
========================= */

const RATE_LIMIT = {
    max: 100,
    windowMs: 60 * 1000
};

const usage = new Map(); // apiKey -> usage stats

/* =========================
   GENERATOR ENGINE
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

function generateUserData() {
    const country = pick(Object.keys(countries));
    const city = pick(countries[country]);
    const name = pick(names);

    const username =
        name.toLowerCase().replace(" ", "") +
        Math.floor(Math.random() * 999);

    return {
        id: crypto.randomUUID(),
        username,
        name,
        email: username + "@mail.com",
        phone: "+" + (Math.floor(Math.random() * 9000000000) + 1000000000),
        country,
        city,
        address: "Street " + Math.floor(Math.random() * 300),
        zip: Math.floor(10000 + Math.random() * 90000),
        createdAt: Date.now()
    };
}

/* =========================
   AUTH SYSTEM
========================= */

function generateToken() {
    return crypto.randomBytes(24).toString("hex");
}

function generateApiKey() {
    return crypto.randomBytes(16).toString("hex");
}

/* =========================
   REGISTER
========================= */

app.post("/auth/register", (req, res) => {
    const { email, password } = req.body;

    if (users.has(email)) {
        return res.status(400).json({ error: "User exists" });
    }

    const apiKey = generateApiKey();
    const token = generateToken();

    const user = {
        email,
        password,
        apiKey,
        createdAt: Date.now()
    };

    users.set(email, user);
    sessions.set(token, email);

    usage.set(apiKey, {
        requests: 0,
        lastReset: Date.now()
    });

    res.json({
        token,
        apiKey
    });
});

/* =========================
   LOGIN
========================= */

app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.get(email);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid login" });
    }

    const token = generateToken();
    sessions.set(token, email);

    res.json({
        token,
        apiKey: user.apiKey
    });
});

/* =========================
   AUTH MIDDLEWARE
========================= */

function auth(req, res, next) {
    const token = req.headers["authorization"];

    if (!token || !sessions.has(token)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const email = sessions.get(token);
    req.user = users.get(email);

    next();
}

/* =========================
   RATE LIMIT PER USER
========================= */

function rateLimit(req, res, next) {
    const apiKey = req.user.apiKey;

    if (!usage.has(apiKey)) {
        usage.set(apiKey, {
            requests: 0,
            lastReset: Date.now()
        });
    }

    const record = usage.get(apiKey);
    const now = Date.now();

    if (now - record.lastReset > RATE_LIMIT.windowMs) {
        record.requests = 0;
        record.lastReset = now;
    }

    if (record.requests >= RATE_LIMIT.max) {
        return res.status(429).json({
            error: "Rate limit exceeded"
        });
    }

    record.requests++;
    next();
}

/* =========================
   GENERATE ENDPOINT
========================= */
app.get("/api/generate", auth, rateLimit, (req, res) => {
    const data = generateUserData();
    res.json(data);
});

/* =========================
   BULK
========================= */

app.post("/api/bulk", auth, rateLimit, (req, res) => {
    const count = Math.min(req.body.count || 5, 100);

    const result = [];

    for (let i = 0; i < count; i++) {
        result.push(generateUserData());
    }

    res.json(result);
});

/* =========================
   USAGE STATS
========================= */

app.get("/api/stats", auth, (req, res) => {
    const apiKey = req.user.apiKey;

    const record = usage.get(apiKey);

    res.json({
        requests: record?.requests || 0,
        remaining: RATE_LIMIT.max - (record?.requests || 0)
    });
});

/* =========================
   HEALTH
========================= */

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        version: "v9 SaaS platform"
    });
});

/* =========================
   START
========================= */

app.listen(10000, () => {
    console.log("v9 SaaS platform running");
});
