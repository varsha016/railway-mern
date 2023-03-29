const Product = require("./../models/Product")
const asyncHandler = require("express-async-handler");
const { productUpload } = require("../utils/upload");
const jwt = require("jsonwebtoken")
const fs = require("fs").promises
const path = require("path");

exports.addProduct = asyncHandler(async (req, res) => {

    console.log(req.files);

    productUpload(req, res, async err => {
        const { id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        req.body.employeeId = id

        console.log(req.body);
        const { name,
            brand,
            image,
            category,
            desc,
            price,
            stock,
            employeeId } = req.body
        // if (!name ||
        //     !brand ||
        //     !category ||
        //     !image ||
        //     !desc ||
        //     !price ||
        //     !stock ||
        //     !employeeId) {
        //     return res.status(400).json({
        //         message: "All Falids Reqired"
        //     })

        // }
        if (err) {
            return res.status(400).json({
                message: "Multer Error" + err
            })
        }
        console.log(req.files);
        const fileNames = []
        for (let i = 0; i < req.files.length; i++) {

            fileNames.push(`assets/images/producs/${req.files[i].filename}`)


        }
        const result = await Product.create({
            ...req.body,
            image: fileNames
        })
        res.json({
            message: "Product added successfully",

            result: {
                ...result
            }
        })
    })


})


exports.getAllProducts = asyncHandler(async (req, res) => {
    const result = await Product.find().select(" -createdAt -updatedAt -__v")
    res.json({
        success: true,
        message: " All products featched ",
        result: {
            data: result,
            count: result.length,

        }
    })
})
exports.getSingleProducts = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await Product.findById(productId).select(" -createdAt -updatedAt -__v")
    if (!result) {
        return res.status(401).json({
            message: "Invalid Product Id",

        })
    }
    res.json({
        success: true,
        message: `Product with id ${productId} fetched successfully`,
        result
    })
})
exports.updateProductData = asyncHandler(async (req, res) => {
    const { productId } = req.params
    // console.log(req.body);
    const singleProduct = await Product.findById(productId)
    console.log(singleProduct);
    if (!singleProduct) {
        return res.status(400).json({
            message: "invalid user Id"
        })
    }
    productUpload(req, res, async err => {
        if (err) {
            res.status(400).json({
                message: "multor err" + err
            })
        }

        let filenames = []
        for (let i = 0; i < req.files.length; i++) {
            filenames.push(`assets/images/producs/${req.files[i].filename}`)
        }


        if (filenames.length > 0) {
            for (let i = 0; i < singleProduct.image.length; i++) {
                await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
            }
        } else {
            filenames = singleProduct.image
        }



        const result = await Product.findByIdAndUpdate(productId, {
            ...req.body,
            image: filenames
        }, { new: true })

        console.log(result);
        res.json({
            message: "Product Updated Successfuly",
            result
        })

    })

})



exports.deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await Product.findById(productId)
    if (!result) {
        return res.status(401).json({
            message: "Invalid Product Id for deteleSingle Product",

        })
    }
    await Product.findByIdAndDelete(productId)
    res.json({
        success: true,
        message: "single products deletede succefully ",

    })
})
exports.destroyProducts = asyncHandler(async (req, res) => {
    const result = await Product.deleteMany()
    // await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
    res.json({
        success: true,
        message: "All products deletede succefully ",

    })
})



// exports.updateProductImages = asyncHandler(async (req, res) => {
//     const { productId } = req.params
//     const singleProduct = await Product.findById(productId)
//     if (!singleProduct) {
//         return res.status(400).json({
//             message: "Invalid Product Id"
//         })
//     }

//     productUpload(req, res, async err => {
//         if (err) {
//             return res.status(400).json({
//                 message: "Multer Error " + err
//             })
//         }
//         for (let i = 0; i < singleProduct.image.length; i++) {
//             await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
//         }
//         console.log(singleProduct);
//         const fileNames = []
//         for (let i = 0; i < req.files.length; i++) {
//             fileNames.push(`assets/images/producs/${req.files[i].filename}`)
//         }
//         const result = await Product.findByIdAndUpdate(productId, {
//             image: fileNames
//         }, { new: true })

//         res.json({ message: "ok" })


//     })


// })
