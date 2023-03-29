const Product = require("../models/Product")
const asyncHandler = require("express-async-handler")

exports.getAllProductsAdmin = asyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({
        success: true,
        message: " All products featched ",
        result: {
            data: result,
            count: result.length,

        }
    })
})