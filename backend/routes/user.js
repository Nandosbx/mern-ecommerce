const express = require('express')
const router = express.Router()

const { signup, bringit }  = require('../controllers/user')

router.post('/signup', signup)

router.get('/', bringit)

module.exports = router
