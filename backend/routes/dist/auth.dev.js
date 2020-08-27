"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/auth'),
    signup = _require.signup,
    signin = _require.signin,
    signout = _require.signout,
    bringit = _require.bringit;

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.get('/', bringit);
module.exports = router;