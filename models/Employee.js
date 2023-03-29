const mongoose = require("mongoose")
const employeeSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    email_verify: {
        type: String,
        // required: true

    },
    password: {
        type: String,
        required: true
    },

    address: {
        type: String,
        // required: true

    },
    mobile: {
        type: String,
        // required: true

    },
    mobile_verify: {
        type: Boolean,
        // required: true

    },
    role: {
        type: String,
        // required: true,
        enum: ["intern", "account", "cms", "support", "admin"],
        default: "intern"
    },
    active: {
        type: Boolean,
        // required: true,
        default: true
    },
    joiningDate: {
        type: Date,
        // required: true
    },
    dob: {
        type: Date,
        // required: true
    },
    salary: {
        type: Number,
        // required: true
    },
    gender: {
        type: String,
        // required: true,
        enum: ["male", "female", "other"]
    },



}, { timestamps: true })
module.exports = mongoose.model("employee", employeeSchema)
