const { loginUser, loginEmployee, continueWithGoogle, emailCheck, resetPassword } = require("../controllers/authController")
const { loginLimiter } = require("../meddleware/limiter")

const router = require("express").Router()
router
    .post("/user/login", loginLimiter, loginUser)
    .post("/user/login-with-google", loginLimiter, continueWithGoogle)
    .post("/employee/login", loginLimiter, loginEmployee)
    .post("/user/forgate-password", loginLimiter, emailCheck)
    .put("/user/reset-password/:id", loginLimiter, resetPassword)

module.exports = router