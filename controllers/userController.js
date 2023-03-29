
const User = require("./../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../utils/email")

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(req.body);
        if (!name || !email || !password) {
            throw new Error("All Fileds Required ")
        }
        const found = await User.findOne({ email })
        // console.log(req.body);
        if (found) {
            throw new Error("Email Allready Exits")
        }
        const hashPass = await bcrypt.hash(password, 10)

        const result = await User.create({
            name,
            email,
            password: hashPass
        })
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY)
        sendEmail({
            sendTo: email,
            sub: "welcome to mern e-commerce",
            msg: "We are excited to introduce ChatGPT to get users’ feedback and learn about its strengths and weaknesses. During the research preview, usage of ChatGPT is free. Try it now at chat.openai.com."
        })
        res.json({
            success: true,
            message: "user register successfuly",
            result: {
                id: result._id,
                name,
                token,

            }
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}

exports.editUser = async (req, res) => {
    try {


        console.log(req.body);
        const result = await User.findByIdAndUpdate(req.body.userId, req.body)

        res.json({
            success: true,
            message: "user updated successfuly",

        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findByIdAndDelete(id, req.body)
        res.json({
            success: true,
            message: "user deleted successfuly",
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}
exports.getAllUser = async (req, res) => {
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
exports.getSingleUsers = async (req, res) => {
    try {
        const { id } = req.params

        const result = await User.findOne({ _id: id })
        if (!result) {
            throw new Error("User Not Found")
        }
        console.log(result);
        res.json({
            success: true,
            message: "user fetch single user successfuly",
            result
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}
exports.destroyUsers = async (req, res) => {
    try {

        const result = await User.deleteMany()

        res.json({
            success: true,
            message: "destroy all users",
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}

exports.getUserProfile = async (req, res) => {
    try {

        console.log(req.body);
        const result = await User.findOne({ _id: req.body.userId }).select(" -_id -__v -createdAt -updatedAt")
        if (!result) {
            throw new Error("User Not Found")
        }
        res.json({
            success: true,
            message: "user fetch single user successfuly",
            result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile || "",
                house: result.house || "",
                pincode: result.pincode || "",
                landmark: result.landmark || "",
                state: result.state || "",
                city: result.city || ""
            }
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error" + error,

        })

    }
}


