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

//NOTE Create Category
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)

//NOTE Read Category
router.get('/category/:categoryId', read)

//NOTE Update Category
router.put(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update,
)

//NOTE Delete Category
router.delete(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove,
)

//NOTE List Category
router.get('/categories', list)

//NOTE Param
router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router
