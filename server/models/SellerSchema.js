const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gst_no: {
        type: String,
        validate: {
            validator: function () {
                return !!this.gst_no || !!this.pan_no;
            },
            messages:'Atleast One Of GST Number Or Pan Number Is Required'
        }
    },
    pan_no: {
        type: String,
        validate: {
            validator: function () {
                return !!this.gst_no || !!this.pan_no;
            },
            messages:'Atleast One Of GST Number Or Pan Number Is Required'
        }
    },
    pan_name: {
        type: String,
       required: function() {
      return !!this.pan_no; 
    },
            messages:'Pan name required'
    },
    
    pan_image: {
        type: String,
        required: function() {
      return !!this.pan_no; 
    },
            messages:'Atleast One Of GST Number Or Pan Number Is Required'
    },
    verificationStatus: {
        type: String,
        default: 'pending'
    },
    storeName: {
        type: String,
        required: true,
    },
    pickUpAddress: {
        type: String,
        required: true, 
    },

    pickUpType: {
        type: String,
        enum: ['self', 'courier'],
        default: 'self'
    },
    deliveryCharge: {
        type: String,
        enum: ['self', 'coustomer'],
        default: 'self'
    },
    bankDetails: {
        type: String,
        // bankName: {
        //     type: String,
        //     required: true,
        // },
        // accountHolderName: {
        //     type: String,
        //     required: true,
        // },
        // accountNumber: {
        //     type: String,
        //     required: true,
        // },
        // ifscCode: {
        //     type: String,
        //     required: true,
        // }, 
    },
    //Order Which are in Process
    Orders: [
        {
            order_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required: true
            },
        }
    ],
    
    //Orders which are Completed 
    history: [
        {
            order_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Order",
                required: true
            }
        }
    
    ]
});
const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;