import { Queue } from 'bullmq';
import connection from "../config/ioredisConnection.js";
import logger from "../logger/logger.js"

export const loginQueue = async ()=>{
 try{ const queue =   new Queue('loginQueue', { connection });

//The global concurrency factor is a queue option that determines how many jobs are allowed to be processed in parallel across all your worker instances.

 queue.setGlobalConcurrency(400);
//The global rate limit config is a queue option that determines how many jobs are allowed to be processed in a specific period of time.


// 1 job per second
 queue.setGlobalRateLimit(1, 100);
  return queue
 }catch(err){
    logger.error(`login queue connection error- ${err}`,{
        errorType: "OtherError",
        location: "./queues/email.queue"
    })
 }}

export const signupQueue = async()=>{
  try{  const queue =  new Queue('signupQueue', { connection });
     queue.setGlobalConcurrency(400);
     queue.setGlobalRateLimit(1, 100);
} catch(err){
     logger.error(`signup queue connection error- ${err}`,{
        errorType: "OtherError",
        location: "./queues/email.queue"
    })
}
}
          
