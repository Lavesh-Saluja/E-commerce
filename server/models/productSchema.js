const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type:String,
        required:true,
    },
    price: {
        type: Number,
        required:true,
    },
     discount: {
        type: Number,
    },
    quantity: {
        type: Number,
        required:true,
    },
    category: {
        type: String,
        required:true,
    },
    photo: {
        type: String,
        required:true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: Array,
        default: []
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required:true,
            },
            rating: {
                type: Number,
                required:true,
            },
            comment: {
                type: String,
                required:true,
            },
            title: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
});

const Product = mongoose.model('PRODUCT', productSchema);
module.exports = Product;