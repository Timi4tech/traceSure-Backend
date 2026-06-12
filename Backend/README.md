##TRACESURE README FILE
# Project Name
Trace Sure
This is a  backend system that store products manufacturing stages through crypto hashing  for  consumers verification and traceability assurance.
## Features
-	 User login
-	User regisration
-	Password verification
-	Jwt authorization and authentication
-	Crypto hashing
-	Rate limitiing and idempotency
-	Email notifications
-	Message queue and workers

##Tech Stack
-	Node.js
-	Express
-	Mongo Db
-	Redis
-	BullMq

##installation
```bash
            git clone 
            cd trace_Sure
            npm install

Environment Variables
 ACCESS_JWT_SECRET =[your jwt secret]
REFRESH_JWT_SECRET =[your jwt secret]
NODE_ENV =[development mode]
MONGO_URI = mongodb+srv://username:password@cluster0.xlnxb5l.mongodb.net/?appName=Cluster0
UPSTASH_REDIS_REST_URL =[upstash url]
UPSTASH_REDIS_REST_TOKEN =[Upstash token]
FRONTEND_URL =[frontend url]
PORT =[port]
SMTP_PASS =[your smtp password]
SMTP_PORT = 587
SMTP_USER =[your account@gmail.com]
SMTP_HOST  = smtp.gmail.com
REDIS_URL =[your redis url]

## Architectural design 
    [ “./docs/architectural_pattern.png”]

##API End Points
     **Auth Routes
                         -Endpoints :
                                    Post -      /api/auth/register   -  `user registration` 
                                     Post-       /api/auth/login          -  `User login`
                                     Get -       /api/auth/user           -      `User Data`
                                      Get -       /api/auth/logout        -      `User logout`    
             **Product Routes
                                   -Endpoints: 
                                              Post -       /api/products/        -      `Create product`
                                               Post-        /api/products/template -  `Get products templates`
                                                Get-         /api/products/ - ` Get  products `
                                                 Get-        /api/products/:id - `Get products by id`
                                                 Delete - /api/products/delete - `Delete product`
              **Stages Routes 
                                 -Endpoints:
                                       Post -        /api/stages/      - `Add stage`
                                        Get-          /api/stages/      -   `Get stages`
                                        Get -          /api/stages/verify/:id - `Verify product`

              **Templates Routes
                               -Endpoints: 
                                        Post-          /api/templates/ -  `Create template`
                                        Get-          /api/templates/ - `Get templates`
                            
## Running Trace Sure
   Development: 
     ```bash 
            Npm run dev
      ```
Production:
       ```bash
          Npm start
        ```
## contributing 
Pull requests are welcome
##License
MIT

