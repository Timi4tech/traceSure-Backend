import express from "express"
import {register,login,getUser,logout} from "../controllers/authController.js"
import {protect} from "../middleware/authMiddleware.js"
import {rateLimiter} from "../middleware/buckeratelimiter.js"
const router = express.Router()

router.post("/register",rateLimiter,register)
router.post("/login",rateLimiter,login)
router.get("/user",protect,getUser)
router.get("/logout",protect,rateLimiter,logout)

export default router