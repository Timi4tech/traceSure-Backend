import { Queue } from 'bullmq';
import logger from "../logger/logger"


const myQueue = new Queue('paint');

const job = await myQueue.add('wall', { color: 'red' });

job.data; // { color: 'red' }