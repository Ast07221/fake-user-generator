import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   MEMORY SYSTEMS
========================= */

const API_KEYS = new Map();

const RATE_LIMIT = {
    max: 50,
    windowMs: 60 * 1000
};

const cache = new Map();

/* =========================
   CORE GENERATOR
========================= */

const countries = {
    USA: ["New York", "Los Angeles", "Chicago"],
    Germany: ["Berlin", "Munich"],
    France: ["Paris", "Lyon"],
    UK: ["London", "Manchester"]
};

const names = [
    "John Smith",
    "Emma Brown",
    "Liam Johnson",
    "Olivia Davis"
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateUser() {
    const country = pick(Object.keys(countries));
    const city = pick(countries[country]);
    const name = pick(names);

    const username =
        name.toLowerCase().replace(" ", "") +
        Math.floor(Math.random() * 999);

    return {
        id: Date.now(),
        username,
        name,
        email: username + "@mail.com",
        phone:
            "+" +
            (Math.floor(Math.random() * 9000000000) +
                1000000000),
        country,
        city,
        address: "Street " + Math.floor(Math.random() * 300),
        zip: Math.floor(10000 + Math.random() * 90000),
        version: "v8"
    };
}

/* =========================
   API KEY
========================= */

function createApiKey() {
    return crypto.randomBytes(16).toString("hex");
}

const DEFAULT_KEY = createApiKey();
API_KEYS.set(DEFAULT_KEY, {
    requests: 0,
    lastReset: Date.now()
});

console.log("DEFAULT API KEY:", DEFAULT_KEY);

/* =========================
   AUTH
========================= */

function auth(req, res, next) {
    const key = req.headers["x-api-key"];

    if (!key || !API_KEYS.has(key)) {
        return res.status(401).json({
            error: "Invalid API key"
        });
    }

    req.apiKey = key;
    next();
}

/* =========================
   RATE LIMIT
========================= */

function rateLimit(req, res, next) {
    const key = req.apiKey;
    const record = API_KEYS.get(key);
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
   CACHE KEY
========================= */

function cacheKey(type) {
    return `gen_${type}`;
}

/* =========================
   ROUTES
========================= */

app.get(
    "/api/generate",
    auth,
    rateLimit,
    (req, res) => {
        const type = req.query.type || "user";

        const key = cacheKey(type);
        const cached = cache.get(key);

        if (cached && Date.now() - cached.time < 1000) {
            return res.json(cached.data);
        }

        let data;

        if (type === "user") {
            data = generateUser();
        } else {
            return res.status(400).json({
                error: "Unknown type"
            });
        }

        cache.set(key, {
            data,
            time: Date.now()
        });

        res.json(data);
    }
);

app.post(
    "/api/bulk",
    auth,
    rateLimit,
    (req, res) => {
        const count = Math.min(
            req.body.count || 5,
            100
        );

        const result = [];

        for (let i = 0; i < count; i++) {
            result.push(generateUser());
        }

        res.json(result);
    }
);

/* =========================
   HEALTH CHECK (FIXED)
========================= */

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "fake-user-generator",
        version: "v8"
    });
});

/* =========================
   START
========================= */

app.listen(10000, () => {
    console.log(
        "v8 SaaS production running on port 10000"
    );
    console.log("API KEY:", DEFAULT_KEY);
});
