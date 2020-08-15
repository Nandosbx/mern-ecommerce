const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req,(error, fields, files) =>{
    if(error){
      return res.status(400).json({
        error: 'Image could not be uploaded'
      })
    }

    let product = new Product(fields)
    
    if(files.photo){
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }

    product.save((error, result) =>{
      if(error){
        return res.status(400).json({
          error:errorHandler(error)
        })
      }
      console.log(error)
      res.json(result)
    })
  })
}