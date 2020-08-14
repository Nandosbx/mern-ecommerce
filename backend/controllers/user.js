const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.signup = (req, res) => {
    console.log('Req-body: ', req.body)    

    const user = new User(req.body)
    user.save((error, user) => {
        if (error) {
            return res.status(400).json({
                error:errorHandler(error)
            }) 
        }

        user.salt = undefined
        user.hashed_password = undefined
        res.json({ 
            user 
        })
    })
}

exports.bringit = (req, res) => {
    console.log('Recebido')
    res.json({"Message": "Enviado"})
}