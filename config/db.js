const mongoose = require("mongoose")
const connectedDb = () => {
    try {
        mongoose.set("strictQuery", true)
        mongoose.connect(process.env.MONGO_URL)
        // console.log("MONGO CONNECTED");
    } catch (error) {
        console.log("MONGO ERRORS" + error);

    }
}
module.exports = connectedDb