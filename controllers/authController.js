const User = require("./../models/User")
const Employee = require("./../models/Employee")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Cart = require("../models/Cart")
const { json } = require("express")
const { OAuth2Client } = require("google-auth-library")
const { sendEmail } = require("../utils/email")
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({
            message: "All Fileds required"
        })
    }
    const result = await User.findOne({ email }).lean()
    if (!result) {
        return res.status(401).json({
            message: " Email is not Registerd with us"
        })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({
            message: "your Pasword Wrong"
        })
    }
    if (!result.active) {
        return res.status(401).json({
            message: "Account Blocked by Admin"
        })
    }
    // const token= jwt.sign({id:result._id},process.env.JWT_KEY,{expiresIn:"15m"}) token expair hot
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY,
        // { expiresIn: "wd" }
    )
    const cart = await Cart.find({ userId: result._id })
    res.json({
        message: "Login Successfully",
        result: {
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            house: result.house,
            city: result.city,
            state: result.state,
            pincode: result.pincode,
            landmark: result.landmark,
            cart,
            token
        }
    })
})
exports.loginEmployee = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({
            message: "All Fileds required"
        })
    }
    const result = await Employee.findOne({ email }).lean()

    if (!result) {
        return res.status(401).json({
            message: " Email is not Registerd with us"
        })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({
            message: " Email Or Pasword Wrong"
        })
    }
    // const token= jwt.sign({id:result._id},process.env.JWT_KEY,{expiresIn:"15m"}) token expair hot
    if (!result.active) {
        return res.status(401).json({
            message: "Account Is Blocked. Get In Touch with Admin "
        })
    }
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY,)
    // https://127.0.0.1:550/test.html
    // res.cookie("token", token, {
    //     maxAge: 1000,
    //     httpOnly: true,
    //     // secure:true
    // })

    res.json({
        message: "employee Login Successfully",
        result: {

            name: result.name,
            email: result.email,
            id: result._id,
            token
        }
    })
})


exports.continueWithGoogle = asyncHandler(async (req, res) => {
    const { tokenId } = req.body
    if (!tokenId) {
        return res.status(400).json({
            message: "Please Provide Google Token"
        })
    }
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const { payload: { name, email, picture } } = await googleClient.verifyIdToken({
        idToken: req.body.tokenId
    })
    const result = await User.findOne({ email }).lean()



    if (result) {
        if (!result.active) {
            return res.status(401).json({
                message: "Account Blocked By Admin"
            })
        }
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
            expiresIn: "1d"
        })
        const cart = await Cart.find({ userId: result._id })

        res.json({
            message: "Login Successfully",
            result: {
                ...result,
                cart,
                token
            }
        })

    } else {
        const password = await bcrypt.hash(Date.now().toString(), 10)
        const user = {
            name,
            email,
            password
        }
        const result = await User.create(user).lean()
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
            expiresIn: "1d"
        })
        res.json({
            message: "user Register Success",
            result: {
                ...result,
                cart: [],
                token
            }
        })
    }


})


exports.emailCheck = asyncHandler(async (req, res) => {
    const { email } = req.body


    const user = await User.findOne({ email })
    const result = await User.findOne({ email: req.body.email })
    if (!result) {
        return res.status(401).json({
            message: " Email is not Registerd with us"
        })

    }
    sendEmail({
        sendTo: email,
        sub: "Forgete Password",
        msg: `http://localhost:3000/reset-password/${result._id}`
    })
    res.json({
        message: "email send Successfully",
        ...result,

    })
})


exports.resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { id } = req.params
    console.log(req.body);
    console.log(password);
    console.log(id);

    if (!password) {
        return res.status(401).json({
            message: "password fild required"
        })
    }

    const x = await bcrypt.hash(password.pass, 10)
    console.log(x);
    const result = await User.findByIdAndUpdate(id, { password: x })



    if (!result) {
        return res.status(401).json({
            message: "can not found password"
        })

    }
    res.json({
        message: "password reset Successfully",


    })
})

