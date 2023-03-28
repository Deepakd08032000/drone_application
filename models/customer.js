const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Order = require('./order')

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

customerSchema.set('timestamps', true)

customerSchema.post('findOneAndDelete', async(data) => {
    if (data) {
        await Order.deleteMany({
            _id: {
                $in: data.orders
            }
        })
    }
})

module.exports = mongoose.model('Customer', customerSchema)