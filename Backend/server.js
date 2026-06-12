import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import config from "./config/env.Config.js";



import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import stageRoutes from "./routes/stageRoutes.js"
import templateRoutes from "./routes/templateRoutes.js"

dotenv.config()

const app = express()
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

app.listen(config.port, () => {
console.log(`Server running on port ${config.port}`)
})

mongoose.connect(config.mongoDb)
.then(()=>console.log("MongoDB connected"))