import Redis from "ioredis";
import config from "./env.Config.js";
const connection = new Redis(config.redisUrl);
console.log(config.redisUrl);
export default connection;