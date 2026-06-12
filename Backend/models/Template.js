import mongoose from "mongoose"

const TemplateSchema = new mongoose.Schema({

companyId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Company"
},

name:String,

stages:[String]

})

export default mongoose.model("Template",TemplateSchema)