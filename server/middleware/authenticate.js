const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Seller = require("../models/SellerSchema");

const authenticateSeller = async (req, res, next) => { 
    const id = req.rootUser["_id"];
    try {
        console.log(req.rootUser.role, "Root User");
        if (req.rootUser.role !== "seller") {
            return res.status(401).json({ error: "Unauthorized:Access Denied" });
        }
        let seller = await Seller.findOne({ user: id });
        console.log(seller, "Seller");
        if (!seller) {
            return res.status(401).json({ error: "Unauthorized:Access Denied" });
        }
        if (seller.verificationStatus === "pending") {
            return res.status(401).json({ error: "Account Verification Under preocess" });
        }
        if (seller.verificationStatus === "rejected") {
            return res.status(401).json({ error: "Account Verification Rejected" });
        }
        req.seller = seller;
 }catch(err){
     console.log(err);
    }
    next();
};

const authenticateUser = async (req, res, next) => {
    try {
           console.log("Authenticate");
        const token = req.header('Authorization');;
        console.log("Authent", token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) { throw new Error('User not Found') }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
    } catch (err) {
        res.status(401).send('Unauthorized:No token provided');
        console.log(err);
    }
}

module.exports = { authenticateUser, authenticateSeller };