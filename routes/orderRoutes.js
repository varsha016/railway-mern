
const { placeOrder, getUserOrders, userCancelOrders, deleteallorders, orderPayment, verifyPayment, deleteSingleOrders } = require("../controllers/orderController")
const { protected } = require("../meddleware/auth")

const router = require("express").Router()
router
    .post("/order-place", protected, placeOrder)
    .get("/order-histroy", protected, getUserOrders)
    .put("/order-cancel/:orderId", protected, userCancelOrders)
    .delete("/single-dalete/:orderId", protected, deleteSingleOrders)
    .post("/payment", orderPayment)
    .post("/payment/verify", protected, verifyPayment)
    .delete("/destroy", deleteallorders)
module.exports = router