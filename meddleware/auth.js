const jwt = require("jsonwebtoken")
const Employee = require("./../models/Employee")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")
exports.adminProtected = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    // const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Please Provide token"
        })
    }
    const { id } = jwt.verify(token, process.env.JWT_KEY)
    const result = await Employee.findById(id)

    if (!result) {
        return res.status(401).json({
            message: "Can Not Find this users"
        })
    }

    if (result.role !== "admin") {
        return res.status(401).json({
            message: " Admin Only Route ,Please get in touch with admin"
        })
    }
    req.body.EmployeeID = id
    next()
})

exports.protected = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    // console.log("XXX", req.cookies);
    if (!token) {
        return res.status(401).json({
            message: "Please Provide token"
        })
    }
    const [, tk] = token.split(" ")
    // const tk=token.split(" ")[1]
    const { id } = jwt.verify(tk, process.env.JWT_KEY)
    if (!id) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
    const result = await User.findById(id)
    if (!result.active) {
        return res.status(401).json({
            message: "Account Is Blocked By Admin, Get In Touch with Admin"
        })
    }
    req.body.userId = id
    next()
})
