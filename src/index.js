import express from "express"
import Redis from "ioredis"
import mongoose from "mongoose"

const app = express()

// Redis Client setup
const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
) 

redis.on("connect", () => {
  console.log('Redis connected')
})
redis.on("error", (err) => {
  console.error("Redis Error:", err.message)
})
// Test Redis endpoints
app.get('/redis', async(req, res) => {
  const reply = await redis.ping()
  res.json({ redis: reply });
})

// Test mongo endpoints
app.get('/mongo', async (req, res) => {
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017/shruti_and_redis'
  if(mongoose.connection.readyState !== 1) {
    await mongoose.connect(url)
  }
  res.json({
    mongo: 'connected',
    database: mongoose.connection.db.databaseName
  })
})

app.listen(4000, () => {
  console.log(`Server is running at 4000`)
})