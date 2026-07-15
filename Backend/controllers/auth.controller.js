import Company from "../models/company.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { loginQueue,signupQueue } from "../queues/emailQueue.js"
import {env} from "../config/env.Config.js"
import redis from "../utils/redisClient.js"
import logger from "../logger/logger.js"
import {createUserSchema, zodErrorTree} from "../schema/user.schema.js"
import { error } from "console"

export const register = async(req,res)=>{
try{

 const validateQuery = createUserSchema.safeParse(req.body)
 if (validateQuery.success){
  const validatedQuery =  validateQuery.data
const hashed = await bcrypt.hash(validatedQuery.password,10)

const company = await Company.create({
name:validatedQuery.name,
email:validatedQuery.email,
password:hashed
})
const refreshToken = jwt.sign(
{id:company._id},
config.refreshJwtSecret,
{expiresIn:"7d"}
)

const accessToken = jwt.sign(
{id:company._id},
config.accessJwtSecret,
{expiresIn:"1h"}
)


res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60* 1000,
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

      await signupQueue.add(
  "sendWelcomeEmail",
  { name: company.name,
    email: company.email,
    login: Date.now()
   },
  { removeOnComplete: createUserSchema.removeOnComplete, removeOnFail: createUserSchema.removeOnFail }
);
   
res.status(201).json(company)
 }else{
   res.status(400).json({error:zodErrorTree(validateQuery.error)})
   logger.warn(`User registration validation failed - ${zodErrorTree(validateQuery.error)}`,{
    errorType: "ValidationError",
    location: './controller/auth.controller'
   })
 }
}catch(err){
  logger.error(`User registration failed`,{
    errorType: "OtherError",
    location:"./controller/auth.controller"
  })
  res.status(500).json({error:err})
}
}

export const login = async(req,res)=>{
try{

const validateQuery = createUserSchema.safeParse(req.body)
 if (validateQuery.success){
 const validatedQuery = validateQuery.data
 const email = validatedQuery.emali
const company = await Company.findOne({email})

if(!company){
return res.status(400).json({message:"Invalid Email", success:false})
}

const match = await bcrypt.compare(validatedQuery.password,company.password)

if(!match){
return res.status(400).json({message:"Invalid Password", success:false})
}
 
const refreshToken = jwt.sign(
{id:company._id},
config.refreshJwtSecret,
{expiresIn:"7d"}
)

const accessToken = jwt.sign(
{id:company._id},
config.accessJwtSecret,
{expiresIn:"1h"}
)

res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60* 1000,
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
       
    


    await loginQueue.add(
  "sendLoginEmail",
  { name: company.name,
    email: company.email,
    login: Date.now()
   },
  { removeOnComplete: createUserSchema.removeOnComplete, removeOnFail: createUserSchema.removeOnFail },
);


res.status(200).json({ success: true });
 }else{
  logger.warn(`login validation failed- ${zodErrorTree(validateQuery.error)}`,{ 
    errorType: 'ValidatedError',
    location: "./controller/auth.controller"
  })
  res.status(400).json({error: zodErrorTree(validateQuery.error)})
 }
}catch(err){
  logger.error(`login errror - ${zodErrorTree(validateQuery.error)}`,{
    errorType: "OtherError",
    location: "./controller/auth.controller"
  })
  res.status(500).json({error:err})
}
}


export const getUser = async(req,res)=>{

try{
  const cached =  await redis.get(req.userId)
   if (cached){
    const company =  JSON.parse(cached)
    res.json(company)
   }else{
const company = await Company.findById(req.userId).select("-password")

if(!company){
return res.status(404).json({message:"Company not found"})
}
await redis.set(req.userId,JSON.stringify(company),{Ex:60*24*7})
res.json(company)
}

}catch(err){
logger.error(`get user error - ${err}`,{
  errorType:"OtherError",
  location:"./controller/auth.controller"
})
res.status(500).json({error:err})

}

}

export const logout = async (req, res) => {
  try{
    const user = req.user._id
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none", // or "lax" depending on your setup
  });
res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none", 
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
  logger.info(`user_${user} logged out successfully`)
}catch(err){
  logger.error(`user_${user} logout failed`,{
    errorType: "OtherError",
    location: "./controller/auth.controller"
  })
}
}
