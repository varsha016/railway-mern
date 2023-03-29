const rateLimiter = require("express-rate-limit")
const { format } = require("date-fns")
const { logEvent } = require("./logger")
exports.loginLimiter = rateLimiter({
    windowMs: 60 * 1000,
    max: 1000,
    message: "too many attempts",
    handler: (req, res, next, options) => {
        const msg = `${format(new Date(), "dd-MM-yyyy\t HH:mm:ss")}
        \t${req.url}\t${req.method}\t${req.headers.origin}\t too may login attempts \n`
        logEvent({
            message: msg,
            fileName: "error.log"
        })

        res.status(401).json({
            message: "too many attempts ,Please retry after 60 seconds"
        })
    }
})