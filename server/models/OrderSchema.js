const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            }
        }
    ],
    status: {
        type: String,
        default: 'pending'
    },
    reason: {
        type: String,
        default:"Request Under Process"  
    },
    date: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    deliveryDate: {
        type: Date,
    },
 
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;