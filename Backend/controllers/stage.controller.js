import Stage from "../models/Stage.js"
import {createHash} from "../utils/hash.js"
import Product from "../models/Product.js"
import redis from "../utils/redisClient.js"
import logger from "../logger/logger.js"
import {createStageSchema,zodErrorTree} from "../schema/stages.schema.js"

// Add stages to product
export const addStage = async(req,res)=>{
try{

const validateQuery =  createStageSchema.safeParse(req.body)
 if(validateQuery.success){
   const validatedQuery =  validateQuery.data
   const productId =  validatedQuery.productId
   const stageName =  validatedQuery.stageName
   const data =  validateQuery.data
const lastStage = await Stage.findOne({productId})
.sort({timestamp:-1})

const previousHash = lastStage ? lastStage.hash : ""

const product = await Product.findById(productId)
const productName = product.name

const hash = createHash({productId,productName,stageName,data},previousHash)

const stage = await Stage.create({

productId,
productName,
stageName,
data,
previousHash,
hash

})

// Deleting of cached stages for proper synchronization
const stagesKey = `${req.userId}_stages`
await redis.del(stagesKey)


res.status(201).json(stage)

}else{logger.warn(`stage adding validation failed- ${zodErrorTree(validateQuery.error)}`,{
  errorType: "OtherError",
  location: "./controller/stage.controller"
})}
}catch(error){
  logger.error(`add product stage failed - ${error}`, {
    errorType: "OtherError",
    location: "./controller/stage.controller"
  })
  res.statu(500).json({error:error})
}}

export const getStages = async(req,res)=>{
try{const stagesKey = `${req.userId}_stages`
const cached = await redis.get(stagesKey)
if(cached){
  const stages = JSON.parse(cached)
  res.status(200).json(stages)
}else{
const stages = await Stage.find()

await redis.set(stagesKey,stages,{Ex:60*24*7})
res.status(200).json(stages)
}
}catch(err){
    logger.error(`get stages failed - ${error}`, {
    errorType: "OtherError",
    location: "./controller/stage.controller"
  })
  res.status(500).json({message:"Server Error", error:err})
}
}


export const verifyProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const validateQuery = createStageSchema.safeParse(req.params.id)
    if(validateQuery.success){
    const stages = await Stage.find({ productId })
      .sort({ timestamp: 1 })

    if (!stages.length) {
      return res.status(404).json({ message: "No stages found" })
    }

    res.json(stages)

  }else{
    logger.warn(`product verification validation failed - ${zodErrorTree(validateQuery.error)}`, {
      errorType:'ValidationError',
      location: './controller/stage.controller'
    })
  }
} catch (err) {
    logger.warn(`product verification validation error -  ${error}`,{
      errorType: "OtherError",
      location: './controller/stage.controller'
    } )
    res.status(500).json({ error: err })
  }
}