import { Redis } from "@upstash/redis"
import config from "../config/env.Config.js"


const redis = new Redis({
  url: config.upstashRedisRestUrl,
  token: config.upstashRedisRestToken,
})

export default redis