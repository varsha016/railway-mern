const Employee = require("./../models/Employee")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/email")
const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")
exports.registerEmployee = asyncHandler(async (req, res) => {
    const { name,
        email,
        password,
    } = req.body
    if (!name || !email || !password) {

    }
    const duplicate = await Employee.findOne({ email })
    if (duplicate) {
        return res.status(404).json({
            message: "email All Ready Exist"
        })
    }
    const hashPass = bcrypt.hashSync(password, 10)
    const result = await Employee.create({
        ...req.body,
        password: hashPass,
        role: "intern"
    })
    sendEmail({
        sendTo: email,
        sub: "welcome to mern e-commerce skillhub Team",
        msg: "Hello and welcome to our website! We're thrilled to have you here. Please feel free to explore and discover all that we have to offer. If you have any questions or need assistance, don't hesitate to reach out. Thank you for registring with us!"
    })
    res.json({
        success: true,
        message: "employee added successfully"
    })
})
exports.getAllEmployees = asyncHandler(async (req, res) => {
    const result = await Employee.find()

    res.json({
        success: true,
        message: "employee featched successfully",
        result: {
            count: result.length,
            data: result
        }
    })
})
exports.getSingleEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findById(employeeId)
    if (!result) {
        return res.status(401).json({
            message: "Invalid User Id"
        })
    }

    res.json({
        success: true,
        message: "employee featched successfully",
        result
    })
})

exports.updateEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findById(employeeId)
    if (!result) {
        return res.status(401).json({
            message: "Invalid User Id"
        })
    }
    const { password, email } = req.body
    if (password) {
        return res.status(400).json({
            message: "can not change Password"
        })
    }
    if (email) {
        const duplicate = await Employee.findOne({ email })
        if (duplicate) {
            return res.status(400).json({
                message: "duplicate email"
            })
        }
    }
    await Employee.findByIdAndUpdate(employeeId, req.body)

    res.json({
        message: "employee updated successfully",

    })
})
exports.deleteEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params

    const result = await Employee.findOne({ id_: employeeId })
    if (!result) {
        return res.status(400).json({
            message: "Invalid Id"
        })
    }
    await Employee.findByIdAndDelete(employeeId, req.body)

    res.json({
        message: "employee deleted successfully",

    })
})
exports.destroyEmployees = asyncHandler(async (req, res) => {

    const result = await Employee.deleteMany()


    res.json({

        message: "All employee Delete  successfully",

    })
})
exports.EmployeeProfile = asyncHandler(async (req, res) => {

    // const result = await Employee.deleteMany()
    console.log(req.cookies);

    res.json({

        message: "All employee cookess successfully",

    })
})

/////////////////////////////// USERS////////////////////////////////////
exports.adminGetAllUsers = async (req, res) => {
    try {

        const result = await User.find()
        res.json({
            success: true,
            message: "All user fetched successfuly",
            result
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}

exports.adminUserStatus = async (req, res) => {
    const { userId } = req.params
    try {

        const result = await User.findByIdAndUpdate(userId, {
            active: req.body.active
        })
        res.json({
            success: true,
            message: `User ${req.body.active ? "Un Block" : "Block"}Success`,

        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}
exports.adminStat = async (req, res) => {

    try {
        const users = await User.countDocuments()
        const activeUser = await User.countDocuments({ active: true })
        const inActiveUser = await User.countDocuments({ active: false })

        const products = await Product.countDocuments()
        const publishProducts = await Product.countDocuments({ publish: true })
        const unPublishProducts = await Product.countDocuments({ publish: false })

        const Orders = await Order.countDocuments()
        const cancelOrders = await Order.countDocuments({ orderStatus: "cancel" })
        const diliveredOrders = await Order.countDocuments({ orderStatus: "delivered" })
        const paidOrders = await Order.countDocuments({ paymentStatus: "paid" })
        const cOdOrders = await Order.countDocuments({ payMode: "cod" })
        const onlineOrders = await Order.countDocuments({ payMode: "online" })



        res.json({
            success: true,
            message: "Admin stat fetch successfuly",
            result: {
                users,
                activeUser,
                inActiveUser,
                products,
                publishProducts,
                unPublishProducts,
                Orders,
                diliveredOrders,
                paidOrders,
                cOdOrders,
                onlineOrders,
                cancelOrders
            }

        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}