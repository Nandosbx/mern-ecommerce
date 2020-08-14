const express = require('express')
const router = express.Router()

const { signup, signin, signout, bringit }  = require('../controllers/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', signout)

router.get('/', bringit)

module.exports = router
