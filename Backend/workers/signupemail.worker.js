import { Worker } from "bullmq";
import connection from "../config/ioredisConnection.js";
import transporter from "../config/smtpConfig.js";
import config from "../config/env.Config.js";

export const worker = new Worker(
  "signupQueue",
  async (job) => {

    if (job.name === "sendWelcomeEmail") {
      const { email, name } = job.data;

      await transporter.sendMail({
        from: config.smtp_User,
        to: email,
        subject: "Welcome To Trace Sure",
        text: `Hello ${name}, welcome to Trace Sure. Your registration was successful.`,
      });
    }

  },
  {
    connection,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }
);