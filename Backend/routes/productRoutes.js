import express from "express"
import {createProduct,getProducts,getProductsTemplate,deleteProduct,getProductById} from "../controllers/productController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",protect,createProduct)
router.get("/",protect,getProducts)
router.get("/:id",getProductById)
router.post("/template",protect,getProductsTemplate)
router.delete("/delete",protect,deleteProduct)

export default router