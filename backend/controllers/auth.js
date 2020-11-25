//TODO AUTH.JS CONTROLLER
const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const { JWT_SECRET } = require('../config/jwtSecret')

//ANCHOR SignUp
exports.signup = (req, res) => {
    const user = new User(req.body)
    user.save((error, user) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error),
            })
        }

        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user,
        })
    })
}

//ANCHOR Signin
exports.signin = (req, res) => {
    //Encontrar o usuário baseado no email
    const { email, password } = req.body
    User.findOne({ email }, (error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: 'User with that email do not exist',
            })
        }

        //Se usuário for encontrado, verificar email e password
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'email and password do not match',
            })
        }

        //gerar um token com id e um segredo
        const token = jwt.sign({ _id: user._id }, JWT_SECRET)
        res.cookie('t', token, { expire: new Date() + 9999 })
        //retornar resposta para frontend
        const { _id, name, email, role } = user
        return res.json({ token, user: { _id, email, name, role } })
    })
}

//ANCHOR Signout
exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({ message: 'Signout success' })
}

//ANCHOR Require Signin
exports.requireSignin = expressJwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth',
})

//ANCHOR is Auth?
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: 'Access denied',
        })
    }
    next()
}

//ANCHOR is Admin?
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin area, access denied',
        })
    }
    next()
}
