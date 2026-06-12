import Stage from "../models/Stage.js"
import {createHash} from "../utils/hash.js"
import Product from "../models/Product.js"
import redis from "../utils/redisClient.js"

// Add stages to product
export const addStage = async(req,res)=>{

const {productId,stageName,data} = req.body

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

}

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
  res.status(500).json({message:"Server Error", error:err})
}
}


export const verifyProduct = async (req, res) => {
  try {
    const productId = req.params.id

    const stages = await Stage.find({ productId })
      .sort({ timestamp: 1 })

    if (!stages.length) {
      return res.status(404).json({ message: "No stages found" })
    }

    res.json(stages)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Verification failed" })
  }
}