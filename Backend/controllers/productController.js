import Product from "../models/Product.js"
import redis from "../utils/redisClient.js"

export const createProduct = async(req,res)=>{
try{
const {name,templateId,batchNumber,registrationNumber} = req.body

const product = await Product.create({

companyId:req.userId,
name,
templateId,
batchNumber,
registrationNumber

})
const productsKey = `${req.userId}-products`
 await redis.del(productsKey)
 await redis.del(productsKey)

res.status(201).json(product)
}catch(err){
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
    res.status(500).json({error:err, message:"server errror"})
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
  res.status(500).json({error:err, message:"server errror"})
}
}

export const deleteProduct = async (req, res) => {
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
    return res.status(500).json({ message: error.message });
  }
};