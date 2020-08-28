"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/product'),
    create = _require.create,
    productById = _require.productById,
    read = _require.read,
    update = _require.update,
    remove = _require.remove,
    list = _require.list,
    listRelated = _require.listRelated,
    listCategories = _require.listCategories,
    listBySearch = _require.listBySearch,
    photo = _require.photo;

var _require2 = require('../controllers/auth'),
    requireSignin = _require2.requireSignin,
    isAdmin = _require2.isAdmin,
    isAuth = _require2.isAuth;

var _require3 = require('../controllers/user'),
    userById = _require3.userById; //ANCHOR Create Product


router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create); //ANCHOR Read Product

router.get('/product/:productId', read); //ANCHOR Update Product

router.put('/product/:productId/:userId', requireSignin, isAdmin, isAuth, update); //ANCHOR Delete Product

router["delete"]('/product/:productId/:userId', requireSignin, isAdmin, isAuth, remove); //ANCHOR List Product

router.get('/products/related/:productId', listRelated);
router.get('/products', list);
router.get('/products/categories', listCategories); //ANCHOR Product Param

router.param('userId', userById);
router.param('productId', productById);
router.post('/products/by/search', listBySearch);
router.get('/products/photo/:productId', photo);
module.exports = router;