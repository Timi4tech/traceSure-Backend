import Redis from "ioredis";
import {env} from "./env.Config.js";


const connection = async()=>{
    try{ const newConnection  = new Redis(env.REDIS_URL);
       logger.info('redis_tcp connection successful');
       return newConnection
      }catch(error){
    logger.error(`redis_tcp connection failed -  ${error}`,{
     errorType: "OtherError",
     loaction:"./config/ioredis.connection"
    })
}}

export default connection;