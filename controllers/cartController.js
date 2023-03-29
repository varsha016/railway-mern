
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const asyncHandler = require("express-async-handler")


exports.addToCard = asyncHandler(async (req, res) => {
    const { qty, productId } = req.body
    if (!qty || !productId) {
        return res.status(400).json({
            message: "All filed required"
        })
    }
    // console.log(req.body);
    const cartItems = await Cart.findOne({ userId: req.body.userId })
    if (cartItems) {
        // console.log(cartItems);
        const index = cartItems.products.findIndex(p => p.productId.toString() === req.body.productId)
        // console.log(index);
        if (index >= 0) {
            cartItems.products[index].qty = req.body.qty
            console.log(cartItems);
        } else {
            cartItems.products.push(req.body)
        }
        const result = await Cart.findByIdAndUpdate(cartItems._id, cartItems, { new: true })
        console.log(result);
        res.json({
            message: " Cart updated successfully",
            // result

        })
    } else {
        const cartItem = {
            userId: req.body.userId,
            products: [req.body]
        }
        console.log(cartItem);
        const result = await Cart.create(cartItem)
        console.log(result);
        res.json({
            message: "product add in card successfully",
            result

        })

    }

})


exports.getCardData = asyncHandler(async (req, res) => {
    const { userId } = req.body

    const result = await Cart
        .findOne({ userId: userId })
        .populate("products.productId", "name price brand image category desc")
        .select("-__v -createdAt -updatedAt -__v -userId")
        .lean()
    if (!result) {
        return res.json({
            message: "Cart is empty",
            result: []
        })
    }


    const formatedCartItems = result.products.map(p => {
        return {
            ...p.productId,
            qty: p.qty,

        }
    })


    res.json({
        message: "fetch product card successfully",
        result: formatedCartItems
    })
})



exports.destroyCart = asyncHandler(async (req, res) => {
    const result = await Cart.deleteMany()

    res.json({
        message: "deleted alll  From Cart Successfully",

    })
})

exports.emptyCart = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const result = await Cart.deleteOne({ userId })

    res.json({
        message: "deleted alll  From Cart Successfully",
        result

    })
})

exports.removeSingleCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { userId } = req.body


    const result = await Cart.findOne({ userId })
    // console.log(productId);
    // console.log(result.products[0].productId.toString());

    console.log(result);
    const index = result.products.findIndex(item => item.productId.toString() === productId)
    result.products.splice(index, 1)
    const x = await Cart.findByIdAndUpdate(result._id, result, { new: true })
    console.log(x);
    console.log(index);
    res.json({
        message: "remove success"
    })
})