import { Worker } from "bullmq";
import connection from "../config/ioredis.connection.js";
import transporter from "../config/smtp.config.js";
import config from "../config/env.Config.js";
import logger  from "../logger/logger.js";


export const loginEmailworker = async()=>{
 try{const queue = new Worker(
  "loginQueue",
  async (job) => {

    if (job.name === "sendLoginEmail") {
      const { email, name, login } = job.data;

      await transporter.sendMail({
        from: config.smtp_User,
        to: email,
        subject: "New Sign-in",
        text: `Hello ${name}, your login at ${login} was successful.`,
      });
    }

  },
  {
    connection,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }

)
return queue
}catch(err){
 logger.eror(`login email worker error - ${err}`, {
  errorType: "OtherError",
  location: "./worker/loginemail.worker"
 })
}
};