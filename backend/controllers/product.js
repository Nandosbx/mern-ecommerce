const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/dbErrorHandler')

//NOTE Product By Id
exports.productById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category')
        .exec((error, product) => {
            if (error || !product) {
                return res.status(400).json({
                    error: 'Product not found',
                })
            }
            req.product = product
            next()
        })
}

//NOTE Create Product
exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            })
        }

        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping,
        } = fields

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        let product = new Product(fields)

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res
                    .status(400)
                    .json({ error: 'Photo must be less than 1.25mb in size' })
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

//NOTE Read
exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//NOTE Update
exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            })
        }

        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping,
        } = fields

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        let product = req.product
        console.log('Before product: ', product)
        console.log('Fields: ', fields)
        product = _.extend(product, fields)
        console.log('After product: ', product)

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res
                    .status(400)
                    .json({ error: 'Photo must be less than 1.25mb' })
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

//NOTE Remove
exports.remove = (req, res) => {
    let product = req.product

    product.remove((error, deletedProduct) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }
        res.json({
            Message: `Product ${deletedProduct.name} was deleted successfully`,
        })
    })
}

//NOTE List
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

//NOTE Product Related
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((error, products) => {
            if (error) {
                return res.status(400).json({
                    error: 'Product not found',
                })
            }
            res.json(products)
        })
}

//NOTE List Categories
exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (error, categories) => {
        if (error) {
            return res.status(400).json({
                error: 'Categories not found',
            })
        }
        res.json(categories)
    })
}

//NOTE List By Search
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc'
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[0],
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

//NOTE Photo
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}
//NOTE List Search
exports.listSearch = (req, res) => {
    const query = {}

    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' }

        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }

        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                })
            }
            res.json(products)
        }).select('-photo')
    }
}
