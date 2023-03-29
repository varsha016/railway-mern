const { updateEmployee } = require("../controllers/employeeControllers")
const { addProduct, getAllProducts, getSingleProducts, updateProductImages, destroyProducts,
    deleteProduct, updateProductData } = require("../controllers/productController")
const { adminProtected } = require("../meddleware/auth")

const router = require("express").Router()
router
    .get("/", getAllProducts)
    .get("/details/:productId", getSingleProducts)
    .post("/add/product", adminProtected, addProduct)
    .put("/update-product/:productId", adminProtected, updateProductData)
    // .put("/update-product-image/:productId", adminProtected, updateProductImages)
    .delete("/delete/:productId", adminProtected, deleteProduct)
    .delete("/destroy", destroyProducts)
module.exports = router