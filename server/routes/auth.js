const express = require('express');
const router = express.Router();
const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const Product = require("../models/productSchema");
const Order = require("../models/OrderSchema");
const Seller = require("../models/SellerSchema");
const Delivery = require("../models/deliverySchema");
const { authenticateUser, authenticateSeller } = require("../middleware/authenticate");
const mongoose = require("mongoose");
const email =require("../utils/email");

require("../db/conn")

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.post("/login", async (req, res) => {
    const {phone,password} = req.body;
    if (!phone || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    const user = await User.findOne({ phone: phone });
    if (!user) {
         return res.status(400).json({ error: "Invalid Credentials" });
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = await user.generateAuthToken();
    console.log(token,"=========");
    res.cookie("jwtoken", token, { expires: new Date(Date.now() + 6000000) });
    console.log(user);
    res.status(201).json({ success: "User logged in Successfully" });
})  
 
router.post("/register", async (req, res) => {
    const { name, phone, email, password,role } = req.body;
    
    if (!name || !phone || !email || !password || !role) {
        return res.status(422).json({ error: "Please add all the fields" });
    }   
    try {
        let user = await User.findOne({ phone:phone });
        console.log("User", user);
    if (user) {
        return res.status(422).json({ error: "User Already Exist" });
    }
    user = new User({ name, phone, email, password,role });
        const us = await user.save();
        console.log(us);
    return res.status(201).json({ success: "User Registered Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }


}) 
//add Products By seller
router.post("/products",authenticateUser,authenticateSeller ,async (req, res) => { 
    console.log(req.rootUser);
    const { name, description, price, discount, quantity, category ,photo } = req.body;
    if (!name || !description || !price || !quantity || !photo || !category) {
                return res.status(422).json({ error: "Please add all the fields" });
    }

    try {
         const seller = req.seller["_id"];
        let product = new Product({ name, description, price, discount, quantity, category, photo, seller});
        const p = await product.save();
        console.log(p);
            return res.status(201).json({ success: "Product Added Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

router.get('/products',  async (req, res) => {
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 2;
        let products = await Product.find().skip((page - 1) * limit).limit(limit);;
        const len = (await Product.find()).length;
        console.log(products,"----");
        const result = {
            products
        }
        if (page - 1 > 0) {
            result["previous"] = parseInt(page) - 1;
        }
        if ((page) * limit < len)
        {
            result["next"] = parseInt(page) + 1;
            }
        
        res.status(201).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ err });
    }
})

router.get("/product/:id", async (req, res) => {
    console.log("hi");
    try {
        let product = await Product.find({ _id: req.params.id });
        if (!product) {
            res.status(400).json("Product not fount");
        }
        res.status(200).json(product);
    } catch (e) {
        
    }
})

router.post("/addTocart", authenticateUser ,async (req, res) => {
    console.log("Added to cart");
    const { product_id, quantity } = req.body;
    let user=await User.findOne({ _id: req.rootUser["_id"] });
    if (!product_id || !quantity) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
        let product = await Product.findOne({ _id: product_id });
        if (!product) {
            return res.status(422).json({ error: "Product not found" });
        }
        if (product.quantity < quantity) {
            return res.status(422).json({ error: "Product not available" });
        }
        const item = user.cart.find((item) => item.product_id == product_id);
        if (!item)
            user.cart = user.cart.concat({ product_id, quantity });
        else
        {
            const qty = parseInt(item.quantity) + parseInt(quantity);
            if (qty > product.quantity)
                return res.status(422).json({ error: "Product not available" });
            user.cart.map((item) => {
                if (item.product_id == product_id)
                    item.quantity =qty;
            })
    }
            
        await user.save();
        res.status(201).json({ success: "Product Added to cart Successfully" });
    } catch (e) {
        console.log(e);
         res.status(500).json({ err });
    }
    
})


router.post("/removeFromCart", authenticateUser, async (req, res) => {  
    const { product_id } = req.body;
    let user = await User.findOne({ _id: req.rootUser["_id"] });
    if (!product_id) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
        const item = user.cart.find((item) => item.product_id == product_id);
        if (!item)
            return res.status(422).json({ error: "Product not found" });
        user.cart = user.cart.filter((item) => item.product_id != product_id);
        await user.save();
        res.status(201).json({ success: "Product Removed from cart Successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ err });
    }
}
)

router.post("/registerSeller", authenticateUser, async (req, res) => { 
    const { pan_no, pan_name, pan_image, storeName, pickUpAddress, pickUpType, deliveryCharge, bankDetails } = req.body;
     //if gstno is not present then pan details must be present
    //if gstno is present then pan details must not be present
    console.log(req.body);
    
        if(!pan_no || !pan_name || !pan_image)
            return res.status(422).json({ error: "Please add all the fields" });
    
    if(!storeName || !pickUpAddress || !pickUpType || !deliveryCharge)
        return res.status(422).json({ error: "Please add all the fields" });
    console.log(Seller)
    let seller = await Seller.findOne({ user: req.rootUser["_id"] });
    if(seller)
        return res.status(422).json({ error: "Seller Already Exist" });
    seller = await Seller.findOne({ pan_no: pan_no });
    if (seller)
        return res.status(422).json({ error: "Pan Number Already Exist" });
    try {
        seller = new Seller({ user: req.rootUser["_id"], pan_no, pan_name, pan_image, storeName, pickUpAddress, pickUpType, deliveryCharge, bankDetails });
        await seller.save();
        let user = await User.findOne({ _id: req.rootUser["_id"] });
        user.role = "seller";
        await user.save();
        res.status(201).json({ success: "Seller Registered Successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ err });
    }
})

router.post("/buy", authenticateUser, async (req, res) => {
    const { product_id, quantity, address, method } = req.body;
    if (!product_id || !quantity || !address) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
    let user = await User.findOne({ _id: req.rootUser["_id"] });
    let buyer = user["_id"];
    let product = await Product.findOne({ _id: product_id });
    if (!product) {
        return res.status(422).json({ error: "Product not found" });
    }
    if (product.quantity < quantity) {
        return res.status(422).json({ error: "Product not available" });
    }
    let item = await Product.findOne({ _id: product_id });
    let sellerId = item["seller"];
    //Make Order/(Bill)
    let order = new Order({
        seller: sellerId,
        buyer,
        products: [
            {
                product_id,
                quantity,
                price: product.price
            }
        ],
        totalAmount: product.price * quantity,
        address,
        paymentType: method,
    });
    order = await order.save();
    //Make Payment: COD Only for now 
    // Update Seller Orders UndreProcess
    let seller = await Seller.findOne({ _id: sellerId });

    seller.Orders = seller.Orders.concat({ order_id: order["_id"] });
        await seller.save();
        const buyerEmail = user.email;
        console.log("Buyer Email",buyerEmail);
  await email(`<h1>Shree Mohini Plywood</h1> <h3>Your Order is Under Process</h3> <p>Track your Order <a href="#">here</>. 
    You will be informed once your order is confirmed</p > `, "Your Order Status", buyerEmail);
    seller = await User.findOne({ _id: seller["user"] });
    // send notification to seller With OrderID
    const sellersEmail = seller.email;
      await email(`<h1>Shree Mohini Plywood</h1> <h3>You have a new Order</h3> <p>See your Order Details And Confirm the Order<a href="#">here</>.`, "New Order", sellersEmail);
    // Send notification to buyer as order placed successfully with OrderID
        
    // update product quantity
    product.quantity = product.quantity - quantity;
    await product.save();
    // update user history
    user.history = user.history.concat({ order_id: order["_id"] });
    await user.save();
    return res.status(201).json({ success: "Product Bought Successfully" });
}
    catch (e) {
        console.log(e);
        res.status(500).json({ err });
    }
});

router.post("/updateOrderStatus", authenticateUser, authenticateSeller, async (req, res) => { 
    const { order_id, status, reason } = req.body;
    console.log(req.body);
    if (!order_id || !status) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
        let order = await Order.findOne({ _id: order_id });
        console.log("Order:",order);
        if (!order) {
            return res.status(422).json({ error: "Order not found" });
        }
        const seller = await Seller.findOne({ user: req.rootUser["_id"] });
        console.log(seller["_id"])
        if (!order.seller.equals( seller["_id"]))
            return res.status(422).json({ error: "You Are not the seller of this product" });
        order.status = status;
        if (status === "rejected")
        {
            order.reason = reason;
            const buyer = await User.findOne({ _id: order.buyer });
            const buyerEmail = buyer.email;
            console.log("Buyer Email", buyerEmail);
            await email(`<h1>Shree Mohini Plywood</h1> <h3>Your Order is Rejected </h3> <p> ${reason} </p><a href="#">here<a/>.`, "Order Rejected", buyerEmail);
            }
        else {
            const buyer = await User.findOne({ _id: order.buyer });
            const buyerEmail = buyer.email;
            console.log("Buyer Email", buyerEmail);
            await email(`<h1>Shree Mohini Plywood</h1> <h3>Your Order is Confirmed </h3><p> Track Your Order <a>Here</a></p> <a href="#">here<a/>.`, "Order Confirmed", buyerEmail);
        }
        console.log("Order:",order);
        await order.save();
        res.status(201).json({ success: "Order Status Updated Successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ err });
    }

});

router.post("/review", authenticateUser, async (req, res) => { 
    const { product_id, rating, comment, title } = req.body;
    if (!product_id || !rating || !description) {
        return res.status(422).json({ error: "Please add all the fields" });
    } 
    let product = await Product.findOne({ _id: product_id });
    if (!product) {
        return res.status(422).json({ error: "Product not found" });
    }

    let user = await User.findOne({ _id: req.rootUser["_id"] });
    if (!user) {
        return res.status(422).json({ error: "User not found" });
    }
    const item = user.history.find((item) => item.product_id == product_id);
    if (!item) {
        return res.status(422).json({ error: "Product not found in history" });
    }

    const review = await Product.findOne({ reviews: { $elemMatch: { user: user["_id"] } } })
    if (review) {
        return res.status(422).json({ error: "You have already reviewed this product" });
    }
    const reviews = {
        user: user["_id"],
        rating,
        comment,
        title,
        date: Date.now()
    }
    product.reviews = product.reviews.concat(reviews);
    await product.save();
    res.status(201).json({ success: "Review Added Successfully" });
})


module.exports = router;