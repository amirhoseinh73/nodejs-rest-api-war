import express from "express"
import userController from "../controllers/userController.js"
import getSpecificUserByID from "../middlewares/getSpecificUser.js"
import isAdmin from "../middlewares/isAdmin.js"
import isAuth from "../middlewares/isAuth.js"

const router = express.Router()

router.post("/register", userController.register)
router.post("/login", userController.login)
router.all("/logout", isAuth, userController.logout)

router.get("/", isAuth, userController.info)

router.patch("/change-password", isAuth, userController.changePass)
router.patch("/", isAuth, userController.update)

// admin routes
// get all users
router.get("/list", isAuth, isAdmin, userController.list)

// delete user
router.delete("/:id", isAuth, isAdmin, getSpecificUserByID, userController.delete)

export default router