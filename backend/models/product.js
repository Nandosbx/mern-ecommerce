const mongoose= require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },

  description: {
    type: String,    
    required: true,
    maxlength: 32
  },

  price: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32
  },

  category: {
    type:ObjectId,
    required:true,
    ref:'Category'
  },

  quantity: {
    type:Number
  },

  photo: {
    data:Buffer,
    contentType: String
  }

}, {timestamps: true})

module.expoorts = mongoose.model('Products', productSchema)