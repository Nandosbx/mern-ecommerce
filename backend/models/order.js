const mongoose = require('mongoose')
const Schema = require('Schema')
const { ObjectId } = mongoose.Schema

const CartItemSchema = new mongoose.Schema(
    {
        product: {
            type: ObjectId,
            ref: 'Product',
        },

        name: String,
        price: Number,
        count: Number,
    },
    {
        timestamps: true,
    },
)

const CartItem = mongoose.model('CartItem', CartItemSchema)

const OrderSchema = new mongoose.Schema(
    {
        products: [CartItemSchema],
        transaction_id: {},
        amount: {
            type: Number,
        },
        address: String,
        status: {
            type: String,
            default: 'Not processed',
            enum: ['Not processed', 'Shipped', 'Delivered', 'Cancelled'],
        },
        update: Date,
        user: {
            type: ObjectId,
            ref: 'Usere',
        },
    },
    {
        timestamps: true,
    },
)

const Order = mongoose.model('Order', OrderSchema)

module.exports = { Order, CartItem }
