const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required:true,
        unique:true
    },
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required:true,
    },
    role: {   
        type: String,
      required:true, 
    },
    cart: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required:true,
            }
        }
    ],
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})

userSchema.methods.generateAuthToken = async function (req, res) {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;