const User = require('../models/user')
const braintree = require('braintree')
const {
    braintreeMerchantID,
    braintreePublicKEY,
    braintreePrivateKEY,
} = require('../config/braintreeAPI')

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

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true,
            },
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error)
            } else {
                res.json(result)
            }
        },
    )
}
