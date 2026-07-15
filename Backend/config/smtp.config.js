import nodemailer from 'nodemailer'
import {env} from './env.Config.js'
import logger from "../logger/logger.js"

const transporter = async()=>{
 try{ 
     const newNodeMailer = nodemailer.createTransport({
    host : env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: true,
    auth:{
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
    }

})
   return newNodeMailer
   logger.info(`Email Smtp connected successfully`)
}catch(error){
   logger.error(`Email smtp connetion failed - ${error}`,{
    errorType: "OtherError",
    location: "./config/smtp.config"
   })
}
}

export default transporter