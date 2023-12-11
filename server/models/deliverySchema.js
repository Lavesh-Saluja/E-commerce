const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pan_no: {
        type: String,
        required: true,
    },
    pan_name: {
        type: String,
        required: true,
    },
    pan_image: {
        type: String,
        required: true,
    },
    deliveryCenterAddress: {
        type: String,
        required: true,
    },
    deliveryCenterPincode: {
        type: Number,
        required: true,
    },
    deliveryCenterCity: {
        type: String,
        required: true,
    },
    deliveryCenterState: {
        type: String,
        required: true,
    },
    deliveryCenterCountry: {
        type: String,
        required: true,
    },
    deliveryCenterContact: {
        type: String,
        required: true,
    },
    deliveryCenterEmail: {
        type: String,
        required: true,
    },
    deliveryCenterName: {
        type: String,
        required: true,
    },
    drivingLicenseNumber: {
        type: String,
        required: true,
    },
    drivingLicenseExpirationDate: {
        type: Date,
        required: true,
    },

});
const Delivery = mongoose.model('DeliveryPersons', deliverySchema);
module.exports = Delivery;