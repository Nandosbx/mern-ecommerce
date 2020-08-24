const express = require('express')
const router = express.Router()

const { requireSignin, isAdmin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')

const {
    create,
    categoryById,
    read,
    remove,
    update,
    list,
} = require('../controllers/category')

//ANCHOR Create Category
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)

//ANCHOR Read Category
router.get('/category/:categoryId', read)

//ANCHOR Update Category
router.put(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update,
)

//ANCHOR Delete Category
router.delete(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove,
)

//ANCHOR List Category
router.get('/categories', list)

//ANCHOR Param
router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router
