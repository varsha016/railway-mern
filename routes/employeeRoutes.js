const { registerEmployee, getAllEmployees, getSingleEmployee,
    updateEmployee, deleteEmployee, destroyEmployees, EmployeeProfile, adminGetAllUsers, adminUserStatus, adminStat } = require("../controllers/employeeControllers")
const { adminProtected } = require("../meddleware/auth")

const router = require("express").Router()
router
    .get("/", getAllEmployees)
    .get("/detail/:employeeId", getSingleEmployee)
    // .get("/profile", adminProtected, EmployeeProfile)
    .put("/update/:employeeId", updateEmployee)
    .delete("/delete/:employeeId", deleteEmployee)
    .post("/register", registerEmployee)
    .delete("/destroy", destroyEmployees)

    .get("/users", adminProtected, adminGetAllUsers)
    .get("/stat", adminProtected, adminStat)
    .put("/users/status/:userId", adminProtected, adminUserStatus)

module.exports = router