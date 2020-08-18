const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')

//ANCHOR Create Category
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

//ANCHOR Category By Id
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

//ANCHOR Read
exports.read = (req, res) => {
    return res.json(req.category)
}
