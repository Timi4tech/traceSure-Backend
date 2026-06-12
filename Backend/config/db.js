import { Queue } from 'bullmq';

const myQueue = new Queue('paint');

const job = await myQueue.add('wall', { color: 'red' });

job.data; // { color: 'red' }