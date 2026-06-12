import nodemailer from 'nodemailer'
import config from './env.Config.js'

const transporter =  nodemailer.createTransport({
    host : config.smtp_Host,
    port: config.smtp_Port,
    secure: true,
    auth:{
        user: config.smtp_User,
        pass: config.smtp_Password
    }

})

export default transporter