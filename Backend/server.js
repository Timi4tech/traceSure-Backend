import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import {env} from "./config/env.Config.js";
import {register,metricsMiddleware} from "./middleware/metrics"



import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import stageRoutes from "./routes/stageRoutes.js"
import templateRoutes from "./routes/templateRoutes.js"

dotenv.config()

const app = express()
app.use(metricsMiddleware)
app.set("trust proxy", 1);
app.use(cors({
  origin: config.frontEndUrl,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())




app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/stages", stageRoutes)
app.use("/api/templates", templateRoutes)
app.get("/metrics",async(req,res)=>{
  try{
    res.send(await register.metrics())
  }catch(err){
   logger.error(`metrics monitoring error- $ {err}`,{
    errorType:"OtherError",
   })
   res.status(500).json({error:err})
  }
})


app.listen(config.port, () => {
console.log(`Server running on port ${env.PORT}`)
})

mongoose.connect(env.MONGODB)
.then(()=>console.log("MongoDB connected"))