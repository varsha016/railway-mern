const nodemailer = require("nodemailer")
exports.sendEmail = ({ sendTo, sub, msg, htmlMsg }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: "vharkal16@gmail.com",
            pass: "nvugfesgezlhsrfa"
        }

    })
    transporter.sendMail({
        to: sendTo,
        from: "vharkal16@gmail.com",
        subject: sub,
        html: htmlMsg,
        text: msg

    }, err => {

        if (err) {
            console.log(err);
        } else {
            console.log("Email Send Successfully");
        }
    })
}
