const User = require('../models/user')
const braintree = require('braintree')
const {
    braintreeMerchantID,
    braintreePublicKEY,
    braintreePrivateKEY,
} = require('../config/braintreeAPI')
const env = require('dotenv')

env.config()

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: braintreeMerchantID,
    publicKey: braintreePublicKEY,
    privateKey: braintreePrivateKEY,
})

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(response)
        }
    })
}
