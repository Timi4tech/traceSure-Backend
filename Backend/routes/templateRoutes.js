import express from "express"
import {createTemplate,getTemplates} from "../controllers/templateController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",protect,createTemplate)
router.get("/",protect,getTemplates)

export default router