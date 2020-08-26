const express = require('express')
const router = express.Router()

const {
    create,
    productById,
    read,
    update,
    remove,
    list,
    listRelated,
    listCategories,
    listBySearch,
} = require('../controllers/product')
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')

//ANCHOR Create Product
router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create)

//ANCHOR Read Product
router.get('/product/:productId', read)

//ANCHOR Update Product
router.put(
    '/product/:productId/:userId',
    requireSignin,
    isAdmin,
    isAuth,
    update,
)

//ANCHOR Delete Product
router.delete(
    '/product/:productId/:userId',
    requireSignin,
    isAdmin,
    isAuth,
    remove,
)

//ANCHOR List Product
router.get('/products/related/:productId', listRelated)

router.get('/products', list)

router.get('/products/categories', listCategories)

//ANCHOR Product Param
router.param('userId', userById)
router.param('productId', productById)
router.post('/products/by/search', listBySearch)

module.exports = router
