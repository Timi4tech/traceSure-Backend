const {z} = require ("zod")
const dotenv = require('dotenv');
dotenv.config();

const envSchema = z.object ({
     ACCESS_JWT_SECRET: z.strin(),
     REFRESH_JWT_SECRET: z.string(),
     NODE_ENV:z.string(),
     MONGO_URI:z.string(),
     UPSTASH_REDIS_REST_URL:z.string().url(),
     UPSTASH_REDIS_REST_TOKEN:z.string(),
     FRONTEND_URL:z.string(),
     PORT:z.number().int().positve().default(5000),
     SMTP_PASS:z.string(),
     SMTP_PORT:z.number().int(),
     SMTP_USER:z.string(),
     SMTP_HOST:z.string(),
     REDIS_URL:z.string().url(),
})

export const env = envSchema.parse('process.env')