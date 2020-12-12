const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')

//NOTE Create Category
exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }
        res.json({ data })
    })
}

//NOTE Category By Id
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((error, category) => {
        if (error || !category) {
            return res.status(400).json({
                error: 'Category not found',
            })
        }
        req.category = category
        next()
    })
}

//NOTE Read
exports.read = (req, res) => {
    return res.json(req.category)
}

//ANCHOR Update
exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }
        res.json(data)
    })
}

//NOTE Remove
exports.remove = (req, res) => {
    const category = req.category
    category.remove((error) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }
        res.json({
            message: 'Category deleted',
        })
    })
}

//NOTE List
exports.list = (req, res) => {
    Category.find().exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }
        res.json(data)
    })
}

//NOTE
