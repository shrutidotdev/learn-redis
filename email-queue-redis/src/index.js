import express, { raw } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
redis.on("connect",() => {
    console.log("Redis is connected!")
})

redis.on('error', () => {
    console.log("Error while starting redis!")
})

// Queue should be having a name. That is it Queue should have a key
const QUEUE_KEY = "email_queue";

app.post('/emails', async (req, res) => {

    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No content',
        createdAt: new Date().toISOString()
     }

    //  always from left = pushing from left poping from righht
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    res.json({
        queued: true,
        job
    })
})

app.get('/emails/process-one', async (req, res) => {
    // this is the right of doing
    const rawJob = await redis.rpop(QUEUE_KEY)
    if(!rawJob){
        return res.json({message : 'No jobs in the queue'})
    }
    const job = JSON.parse(rawJob)
    // stimulate sending emails 

    res.json({ message: 'Email sent', job})
})

app.listen(3000, () => {
    console.log("Hi there server is running at 3000")
})


// LPUSH inserts from left
// RPUSH inserts from right
// LPOP removes from left
// RPOP removes from right


// JOB Loss there is no retry system 
// Manual workers