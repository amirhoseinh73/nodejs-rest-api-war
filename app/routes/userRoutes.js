import { router } from "../config.js"
import userController from "../controllers/userController.js"
import getSpecificUser from "../middlewares/getSpecificUser.js"
import isAdmin from "../middlewares/isAdmin.js"
import isAuth from "../middlewares/isAuth.js"

// create user or register by admin only
router.post("/register", isAuth, isAdmin, userController.create)

//login user
router.post("/login", userController.login)

// change password
router.patch("/change-password", isAuth, userController.changePass)

// change password
router.all("/logout", isAuth, userController.logout)

// get all users
router.get("/list", isAuth, isAdmin, userController.list)

router.get("/info", isAuth, userController.info)

// get user
router.get("/info/:id", isAuth, getSpecificUser, userController.findOne)

// update user
// patch only update passed information to request
// put update all information of user instead of the information passed
router.patch("/info/:id", isAuth, getSpecificUser, userController.update)

// delete user
router.delete("/:id", isAuth, isAdmin, getSpecificUser, userController.delete)

export default router