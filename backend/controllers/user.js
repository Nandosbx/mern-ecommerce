const User = require('../models/user')

//NOTE User by ID
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

//NOTE Read
exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined

    return res.json(req.profile)
}

//NOTE Update
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

            user.hashed_password = undefined
            user.salt = undefined
            res.json(user)
        },
    )
}

exports.addOrderToUserHistory = (req, res, next) => {
    let history = []

    req.body.order.products.forEach((item) => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount,
        })
    })

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: 'Could not update user purchase history',
                })
            }
            next()
        },
    )
}
