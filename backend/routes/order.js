const express = require('express')
const router = express.Router()

const { userById, addOrderToUserHistory } = require('../controllers/user')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {
    create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus,
} = require('../controllers/order')

const { decreaseQuantity } = require('../controllers/product')

//NOTE
router.post(
    '/order/create/:userId',
    requireSignin,
    isAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create,
)

//NOTE
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders)

//NOTE
router.get(
    '/order/status-values/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues,
)

//NOTE
router.put(
    '/order/:orderId/status/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    updateOrderStatus,
)

//NOTE
router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router
