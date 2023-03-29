const { getAllProductsAdmin } = require("../controllers/adminController")
const { adminProtected } = require("../meddleware/auth")


const router = require("express").Router()
router



    .get("/products", adminProtected, getAllProductsAdmin)





module.exports = router