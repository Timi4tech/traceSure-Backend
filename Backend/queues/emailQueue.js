import { Queue } from 'bullmq';
import connection from "../config/ioredisConnection.js";

export const loginQueue = new Queue('loginQueue', { connection });

//The global concurrency factor is a queue option that determines how many jobs are allowed to be processed in parallel across all your worker instances.

loginQueue.setGlobalConcurrency(400);
//The global rate limit config is a queue option that determines how many jobs are allowed to be processed in a specific period of time.


// 1 job per second
loginQueue.setGlobalRateLimit(1, 100);

export const signupQueue = new Queue('signupQueue', { connection });
signupQueue.setGlobalConcurrency(400);

signupQueue.setGlobalRateLimit(1, 100);
    
          
