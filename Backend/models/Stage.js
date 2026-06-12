import mongoose from "mongoose"

const StageSchema = new mongoose.Schema({

productId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

productName:String,

stageName:String,

data:String,

timestamp:{
type:Date,
default:Date.now
},

hash:String,

previousHash:String

})

export default mongoose.model("Stage",StageSchema)