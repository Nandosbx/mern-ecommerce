const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/dbErrorHandler')

//ANCHOR Product By Id
exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((error, product) => {
        if (error || !product) {
            return res.status(400).json({
                error: 'Product not found',
            })
        }
        req.product = product
        next()
    })
}

//ANCHOR Create Product
exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            })
        }

        const { name, description, price, category, quantity } = fields

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        let product = new Product(fields)

        if (files.photo) {
            if (files.photo.size > 90000) {
                return res
                    .status(400)
                    .json({ error: 'Photo must be less than 90k' })
            } else if (files.photo.size === 0) {
                return res
                    .status(400)
                    .json({ error: 'You should upload an image' })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((error, result) => {
            if (error) {
                return res.status(400).json({
                    error: errorHandler(error),
                })
            }
            res.json(result)
        })
    })
}

//ANCHOR Read
exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//ANCHOR Update
exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            })
        }

        const { name, description, price, category, quantity } = fields

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        let product = req.product
        console.log('Before product: ', product)
        console.log('Fields: ', fields)
        product = _.extend(product, fields)
        console.log('After product: ', product)

        if (files.photo) {
            if (files.photo.size > 90000) {
                return res
                    .status(400)
                    .json({ error: 'Photo must be less than 90k' })
            } else if (files.photo.size === 0) {
                return res
                    .status(400)
                    .json({ error: 'You should upload an image' })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((error, result) => {
            if (error) {
                return res.status(400).json({
                    error: errorHandler(error),
                })
            }
            res.json({ result })
        })
    })
}

//ANCHOR Remove
exports.remove = (req, res) => {
    let product = req.product

    product.remove((error, deletedProduct) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }
        res.json({
            Message: `Produt ${deletedProduct.name} was deleted successfully`,
        })
    })
}

//ANCHOR List
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({
                    error: 'Product not found',
                })
            }

            res.send(data)
        })
}

//ANCHOR Product Related
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({
                    error: 'Product not found',
                })
            }
            res.json(data)
        })
}

//ANCHOR List Categories
exports.listCategories = (req, res) => {
    Product.distinct('categoy', {}, (error, categories) => {
        if (error) {
            return res.status(400).json({
                error: 'Categories not found',
            })
        }
        res.json(categories)
    })
}

//ANCHOR List By Search
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc'
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    for (let key in req.body.filters) {
        if (req.body.filters[key].lenght > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.bodu.filters[0],
                    $lte: req.body.filters[1],
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('categories')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((error, data) => {
            if (error) {
                return req.status(400).json({
                    error: 'Product not found',
                })
            }

            res.json({
                size: data.length,
                data,
            })
        })
}
