const mongoose = require("mongoose")
const userSchema = mongoose.Schema({

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

    },
    mobile: {
        type: String,
        // required: true
    },
    mobile_verify: {
        type: Boolean,

    },

    password: {
        type: String,
        required: true
    },

    address: {
        type: String,

    },
    house: {
        type: String,

    },
    landmark: {
        type: String,

    },
    pincode: {
        type: String,

    },
    state: {
        type: String,

    },
    city: {
        type: String,

    },
    active: {
        type: Boolean,
        default: true
    }


}, { timestamps: true })
module.exports = mongoose.model("user", userSchema)
