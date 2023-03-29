
const { addToCard,
    getCardData,
    removeSingleCartItem,
    emptyCart, destroyCart } = require("../controllers/cartController")
const { protected } = require("../meddleware/auth")

const router = require("express").Router()
router



    .post("/add-to-cart", protected, addToCard)
    .get("/cart-histroy", protected, getCardData)
    .delete("/cart-remove-single/:productId", protected, removeSingleCartItem)
    .delete("/cart-destroy", protected, emptyCart)
    .delete("/empty-cart", destroyCart)




module.exports = router