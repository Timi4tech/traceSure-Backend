import dotenv from 'dotenv'
dotenv.config()

export default {
    accessJwtSecret : process.env.ACCESS_JWT_SECRET,
    refreshJwtSecret : process.env.REFRESH_JWT_SECRET,
    nodeEnvironment : process.env.NODE_ENV,
    mongoDb: process.env.MONGO_URI,
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashRedisRestToken : process.env.UPSTASH_REDIS_REST_TOKEN,
    frontEndUrl: process.env.FRONTEND_URL,
    port:5000,
    smtp_Password: process.env.SMTP_PASS,
    smtp_Port: process.env.SMTP_PORT,
    smtp_User: process.env.SMTP_USER,
    smtp_Host : process.env.SMTP_HOST,
    redisUrl: process.env.REDIS_URL
}