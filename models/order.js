const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    drone_shot: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})

orderSchema.set('timestamps', true)

module.exports = mongoose.model('Order', orderSchema)