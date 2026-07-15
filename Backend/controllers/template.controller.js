import Template from "../models/Template.js"
import redis from "../utils/redisClient.js"
import logger from "../logger/logger.js"
import {createStageSchema,zodErrorTree} from "../schema/stages.schema.js"

export const createTemplate = async(req,res)=>{
try{

const {name,stages} = req.body
 const validateQuery =  createStageSchema.safeParse(req.body)
 if(validateQuery.success){
    const validatedQuery =  validateQuery.data
const template = await Template.create({
companyId:req.userId,
name: validatedQuery.name,
stages: validatedQuery.stages
})
const templatesKey = `${req.userId}_templates`
await redis.del(templatesKey)

res.json(template)
}else{ 
    logger.warn(`template creation failed - ${zodErrorTree(validateQuery.success)}`,{
        errorType: "ValidationError",
        location: "./controller/template.controller"
    })
}
}catch(err){
        logger.error(`template creation error - ${zodErrorTree(validateQuery.success)}`,{
        errorType: "OtherError",
        location: "./controller/template.controller"
    })
}
    res.status(500).json({error:err})
}


export const getTemplates = async(req,res)=>{
try{
    const templatesKey = `${req.userId}_templates`
    const cached = await redis.get(templatesKey)
if(cached){
    const templates = JSON.parse(cached)
    res.status(200).json(templates)
}else{
const templates = await Template.find({companyId:req.userId})
await redis.set(templatesKey,templates,{EX:60*24*7})
res.status(200).json(templates)
}
}catch(err){
        logger.errorType(`get template  error - ${err}`,{
        errorType: "OtherError",
        location: "./controller/template.controller"
    })
}
    res.status(500).json({error:err, message:'request could not be completed'})
}
