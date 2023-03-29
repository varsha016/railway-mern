const fs = require("fs")
const prepend = require("prepend-file")
const { format } = require("date-fns")
const logEvent = async ({ fileName, message }) => {
    try {
        if (!fs.existsSync("./logs")) {
            fs.mkdirSync("./logs")
        }
        await prepend(`./logs/${fileName}`, message)

    } catch (error) {
        console.log(error);

    }

}
const log = (req, res, next) => {
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers.origin);
    const msg = `${format(new Date(), "dd-MM-yyyy \t HH:mm:ss")}\t${req.method}\t${req.url}\t${req.headers.origin}\n`
    logEvent({
        fileName: "req.log",
        message: msg
    })
    next()
}
module.exports = {
    log,
    logEvent
}