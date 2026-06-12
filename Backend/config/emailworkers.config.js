export const app= {
  apps: [
  
    {
      name: "loginQueue",
      script: "./workers/loginemail.worker.js",
      instances: 2,            // Run two separate login worker processes
      autorestart: true,       // Keep alive indefinitely
      watch: false
    },
 {
      name: "signupQueue",
      script: "./workers/signupemail.worker.js",
      instances: 2,            // Run two separate signup worker processes
      autorestart: true,       // Keep alive indefinitely
      watch: false
    },
  ]
};
