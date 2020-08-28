const User = require('../models/user')

//
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: 'User not found',
            })
        }
        //all user info will be save as req.profile
        req.profile = user
        next()
    })
}

//ANCHOR Read
exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined

    return res.json(req.profile)
}

//ANCHOR Update
exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true },
        (error, user) => {
            if (error) {
                return res.status(400).json({
                    error: 'You are not authorized',
                })
            }

            req.profile.hashed_password = undefined
            req.profile.stal = undefined
            res.json(user)
        },
    )
}
