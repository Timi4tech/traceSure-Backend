import Template from "../models/Template.js"
import redis from "../utils/redisClient.js"


export const createTemplate = async(req,res)=>{
try{
const {name,stages} = req.body

const template = await Template.create({
companyId:req.userId,
name,
stages
})
const templatesKey = `${req.userId}_templates`
await redis.del(templatesKey)

res.json(template)
}catch(err){
    res.status(500).json({error:err, message: 'something went wrong'})
}
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
    res.status(500).json({error:err, message:'request could not be completed'})
}
}