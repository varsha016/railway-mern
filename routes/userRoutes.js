const { adminGetAllUsers } = require("../controllers/employeeControllers")
const { registerUser, editUser, deleteUser, getAllUser, getSingleUsers, destroyUsers, getUserProfile } = require("../controllers/userController")
const { protected } = require("../meddleware/auth")

const router = require("express").Router()
router
    .get("/", getAllUser)
    .post("/add", registerUser)
    .get("/profile", protected, getUserProfile)
    .get("/:id", getSingleUsers)
    .put("/profile-update", protected, editUser)
    .delete("/delete/:id", deleteUser)
    .delete("/destroy", destroyUsers)




module.exports = router