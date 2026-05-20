import Redis from "ioredis";
import express from "express";

const app = express();
app.use(express.json());

const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis Error:", err);
});

app.post('/user/:id/json', async(req, res) => {
    const key = `user:${req.params.id}:json`;
    const data = req.body;

    await redis.set(key, JSON.stringify(data));

    res.json({ message : 'Saved in JSON'});
});

app.get('/user/:id/json', async(req, res) => {
    const key = `user:${req.params.id}:json`;

    const raw = await redis.get(key);

    const user = raw ? JSON.parse(raw) : null;

    res.json(user);
});

app.post('/user/:id/hash', async(req, res) => {
    const key = `user:${req.params.id}:hash`;

    await redis.hset(key, req.body);

    res.json({ message: "Saved in Hash"});
});

app.get('/user/:id/hash', async(req, res) => {
    const key = `user:${req.params.id}:hash`;

    const user = await redis.hgetall(key);

    res.json(user);
});

app.listen(3000, () => {
    console.log("server running......");
});