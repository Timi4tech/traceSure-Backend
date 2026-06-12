import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },

  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template"
  },

  name: String,

  batchNumber: String,

  registrationNumber: String,

  manufacturingDate: String,

  expiryDate: String,

  // 🔴 DELETE SYSTEM (IMPORTANT)
  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date,
    default: null
  },

  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  deleteReason: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

export default mongoose.model("Product", ProductSchema)