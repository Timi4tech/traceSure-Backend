import express from "express"
import {addStage,getStages,verifyProduct} from "../controllers/stageController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",protect,addStage)
router.get("/",protect,getStages)
router.get("/verify/:id",verifyProduct)

export default router