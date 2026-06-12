import { Worker } from "bullmq";
import connection from "../config/ioredisConnection.js";
import transporter from "../config/smtpConfig.js";
import config from "../config/env.Config.js";







export const loginEmailworker = new Worker(
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
);