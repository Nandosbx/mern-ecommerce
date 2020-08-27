const User = require('../models/user')

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .exec((error, user) => {
      if(error || !user) {
        return res.status(400).json({
          error : 'User not found'
        })
      }
      //all user info will be save as req.profile
      req.profile = user
      next()
    })    
}