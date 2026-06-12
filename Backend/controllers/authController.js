import Company from "../models/company.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { loginQueue,signupQueue } from "../queues/emailQueue.js"
import config from "../config/env.Config.js"
import redis from "../utils/redisClient.js"


export const register = async(req,res)=>{
try{
const {name,email,password} = req.body

const hashed = await bcrypt.hash(password,10)

const company = await Company.create({
name,
email,
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
  { removeOnComplete: 1000, removeOnFail: 5000 }
);
   
res.status(201).json(company)
}catch(err){
  res.status(400).json({error:err, message:'Bad request'})
}
}

export const login = async(req,res)=>{
try{
const {email,password} = req.body

const company = await Company.findOne({email})

if(!company){
return res.status(400).json({message:"Invalid Email", success:false})
}

const match = await bcrypt.compare(password,company.password)

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
  { removeOnComplete: 1000, removeOnFail: 5000 },
);


 
res.status(200).json({ success: true });
}catch(err){
  res.status(400).json({error:err,message:'Bad request'})
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

res.status(500).json({message:"Server error"})

}

}

export const logout = async (req, res) => {
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

}

