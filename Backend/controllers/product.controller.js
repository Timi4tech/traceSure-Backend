import Product from "../models/Product.js"
import redis from "../utils/redisClient.js"
import logger from "../logger/logger.js"
import { createProductSchema,zodErrorTree } from "../schema/product.schema.js"

export const createProduct = async(req,res)=>{
try{

 const validateQuery =  createProductSchema.safeParse(req.body)
 if(validateQuery.success){
   const validatedQuery = validateQuery.data
const product = await Product.create({
companyId:req.userId,
name:validatedQuery.name,
templateId:validatedQuery.templateId,
batchNumber:validatedQuery.batchNumber,
registrationNumber:validatedQuery.registrationNumber

})
const productsKey = `${req.userId}-products`
 await redis.del(productsKey)
 await redis.del(productsKey)

res.status(201).json(product)
}else{
  logger.warn(`production validation error - ${zodErrorTree(validateQuery.error)}`,{
    errorType: `ValidationError`,
    location: `./controller/product.controller`
  })
  res.status(400).json({error: zodErrorTree(validateQuery.error)})
}
}catch(err){
  logger.error(`production creation error - {error}`,{
    errorType: "OtherError",
    location: `./controller/product.controller`
  })
  res.status(500),json({error:err, message:"server errror"})
}

}

export const getProducts = async(req,res)=>{
  try{
const productsKey = `${req.userId}-products`
 const cached =  await redis.get(productsKey)
 if(cached){
  const products = JSON.parse(cached)
  res.status(200).json(products)
 }else{

const products = await Product.find({
companyId:req.userId
})
const product = JSON.stringify(products)
await redis.set(productsKey,product,{EX:60*24*7})

res.status(200).json(products)
 }
  }catch(err){
    logger.error(`get products failed - ${error}`,{
      errorType: "OtherError",
      location: ",/controller/product.controller"
    })
    res.status(500).json({error:err})
  }

}

export const getProductsTemplate = async (req,res) => {
try{
const { templateId } = req.body
if(templateId){
const productKey = `${req.userId}-${templateId}`
const cached = await redis.get(productKey)
if (cached){
  const product =  JSON.parse(cached)
  res.status(200).json(product)
}else{
     
const products = await Product.find({ templateId })
  .populate("templateId")
 const product = JSON.stringify(products)
  await redis.set(productKey,product,{EX:60*24*7})
res.json(products)
}
}else{
  res.status(401).json({message: "client errror"})
}
}catch(err){
      logger.error(`get products  template failed - ${error}`,{
      errorType: "OtherError",
      location: ",/controller/product.controller"
    })
  res.status(500).json({error:err})
}
}

export const deleteProduct = async (req, res) => {
try{
  const { productId } = req.body

  const product = await Product.findById(productId)

  // ✅ Idempotency check
  if (!product || product.isDeleted) {
    return res.status(200).json({
      success: true,
      message: "Product already deleted"
    })
  }

  product.isDeleted = true
  product.deletedAt = new Date()
  product.deletedBy = req.userId
  product.deleteReason = req.body.reason || null

  await product.save()

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  })
}catch(error){
  logger.error(`product delete failed - ${error}`,{
    errorType:"OtherError",
    location:"/controller/product.controller"
  })

  res.status(500).json({error:`product delete failed`})
}
}
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params.id;
   const productkey = `${req.userId}_${id}`
   const cached =  await redis.get(productkey)
   if (cached){
      const product =  JSON.parse(cached)
      res.status(200).json(product)
   }else{
    const product = await Product.findOne({id});

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await redis.set(productkey,product)

    return res.status(200).json(product);
  }
  } catch (error) {
    logger.errror(`get products by Id failed - ${error}`,{
      errorType: "OtherError",
      location: "/controller/product.controller"
    })
    return res.status(500).json({ message: `error fetching products` });
  }
};