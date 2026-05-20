import express from "express"
import Redis from "ioredis"

const app = express()
app.use(express.json())
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// This is a very standard process so do follow this with understand of thosse logic
function otpKey(phone) {
    return `otp:${phone}`
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await redis.set(otpKey(phone), otp, 'EX', 30)
    console.log(`OTP sent to phone number; ${otp}`)
    res.json({
        message: 'OTP sent successfully',
        success: true
    })
})

app.post('/verify', async (req, res) => {
    const { phone, otp } = req.body
    if (!otp || !phone) {
        return res.json({
            message: 'Both are required',
            success: false
        })
    }

    const savedOtp = await redis.get(otpKey(phone))

    // If the key has hit its TTL expiry, it returns null
    if (!savedOtp) {
        return res.json({
            message: 'OTP expired or not found',
            success: false
        })
    }

    if (savedOtp != otp) {
        return res.json({
            message: 'INVALID OTP',
            success: false
        })
    }

    await redis.del(otpKey(phone))
    res.json({
        message: "OTP Verified Successfully",
        success: true
    })
})

app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params
    const ttl = await redis.ttl(otpKey(phone))

   if (ttl > 0) {
    return res.json({
        message: `OTP will expire in ${ttl} seconds`,
        success: true,
        ttl
    })
} else if (ttl === -2) {
    return res.json({
        message: 'OTP expired or not found',
        success: false
    })
} else if (ttl === -1) {
    // Edge case - shouldn't happen with your SET logic
    return res.json({
        message: 'OTP has no expiration (unexpected)',
        success: false
    })
}
})

app.listen(3000, () => {
    console.log('Server is running')
})