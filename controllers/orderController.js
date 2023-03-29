
const Product = require("../models/Product")
const Order = require("../models/Order")
const User = require("../models/User")
const Cart = require("../models/Cart")
const { sendEmail } = require("../utils/email")
const asyncHandler = require("express-async-handler")
const Razorpay = require("razorpay")
const { v4: uuid } = require("uuid")
const crypto = require("crypto")
const { orderRecipt } = require("../utils/emailTemplate")
const { json } = require("express")
exports.placeOrder = asyncHandler(async (req, res) => {

    const { userId, type } = req.body
    if (!type) {
        return res.status(400).json({
            message: "please Provider type"
        })
    }
    let productArray
    if (type === "buynow") {

        productArray = [{
            productId: req.body.productId,
            qty: req.body.qty
        }]

    } else {
        const cartItems = await Cart.findOne({ userId })
        // console.log(cartItems, "cart");
        await Cart.deleteOne({ userId })
        productArray = cartItems.products
    }

    const result = await Order.create({
        userId,
        products: productArray,
        paymentMode: "cod"
    })




    res.json({
        message: "Order Placed successfully",
        result
    })
})
exports.getUserOrders = asyncHandler(async (req, res) => {

    // console.log(req.body, "order user");
    const result = await Order.find({ userId: req.body.userId })
        .populate("products.productId")
        .select(" -__v -createdAt -updatedAt -__v")
    // .populate({
    //     path: "products",
    //     populate: {
    //         path: "productId",
    //         model: "product"

    //     }
    // })

    console.log(result, "order")
    res.json({
        message: "user get Order  successfully",
        count: result.length,
        result
    })
})

exports.userCancelOrders = asyncHandler(async (req, res) => {

    const { orderId } = req.params
    const result = await Order.findByIdAndUpdate(orderId, {
        orderStatus: "cancel"
    })
    res.json({
        message: "Order cancel successfully",
        result
    })
})


exports.orderPayment = asyncHandler(async (req, res) => {
    const instanse = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    })
    instanse.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: uuid()


    }, (err, order) => {
        if (err) {
            return res.status(400).json({
                message: "order Fail" + err
            })
        }
        res.json({
            message: "payment Initiated",
            order
        })

    })
})
exports.verifyPayment = asyncHandler(async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature
    } = req.body
    const key = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
        .createHmac("sha256", `${process.env.RAZORPAY_SECRET}`)
        .update(key.toString())
        .digest("hex")
    if (expectedSignature !== razorpay_signature
    ) {
        return res.status(400).json({
            message: "Invalid Payment Singnature Mismatch"
        })
    }




    const { userId, type } = req.body
    const user = await User.findOne({ _id: userId })

    let cartItems, result, productDetails, formatedCartItems, total

    if (type === "cart") {
        cartItems = await Cart.findOne({ userId })
        productDetails = await Cart
            .findOne({ userId: userId })
            .populate("products.productId", "name price brand image category desc")
            .select("-__v -createdAt -updatedAt -__v -userId")
            .lean()
        formatedCartItems = productDetails.products.map(p => {
            return {
                ...p.productId,
                qty: p.qty,

            }
        })
        console.log(formatedCartItems);

        total = formatedCartItems.reduce((sum, i) => sum + (i.price * i.qty), 0)


        await Cart.deleteOne({ userId })
    } else if (type === "buynow") {
        cartItems = {
            products: [{
                productId: req.body.productId,
                qty: req.body.qty
            }]


        }
        const p = await Product.findOne({ _id: req.body.productId })
        total = p.price * req.body.qty
        formatedCartItems = [{

            name: p.name,
            price: p.price,
            qty: req.body.qty,


        }]
    }


    result = await Order.create({
        userId,
        products: cartItems.products,
        paymentMode: "online",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentSignature: razorpay_signature,
        paymentStatus: "paid"
    })
    sendEmail({
        sendTo: user.email,
        sub: "Place Your Order Successfully",
        htmlMsg: orderRecipt({
            userName: user.name,
            date: Date.now(),
            orderId: result._id,
            products: formatedCartItems,
            total

        }),
        msg: ` Thank you for your order \n
    Order Id:${result._id} \n
    Payment Status : Paid \n
    Payment Mode : online \n
    Payment Id :${result.paymentId}`
    })

    res.json({
        message: "payment Success"
    })


})

exports.deleteallorders = asyncHandler(async (req, res) => {

    // const { userId } = req.body

    const result = await Order.deleteMany()

    res.json({
        message: "deleted alll  From Cart Successfully",

    })
})
exports.deleteSingleOrders = asyncHandler(async (req, res) => {

    const { orderId } = req.body

    const result = await Order.findByIdAndDelete(orderId, req.body)
    if (!result) {
        return res.status(400).json({
            message: "Not found OrderId"
        })
    }

    res.json({
        message: "deleted alll  From Cart Successfully",
        result

    })
})