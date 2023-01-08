import { router } from "../config.js"
import userController from "../controllers/userController.js"
import getSpecificUser from "../middlewares/getSpecificUser.js"
import isAdmin from "../middlewares/isAdmin.js"
import isAuth from "../middlewares/isAuth.js"

// get all users
router.get("/", isAuth, isAdmin, userController.list)

// get user
router.get("/:id", isAuth, getSpecificUser, userController.findOne)

// create user
router.post("/", userController.create)

// update user
// patch only update passed information to request
// put update all information of user instead of the information passed
router.patch("/:id", isAuth, getSpecificUser, userController.update)

// delete user
router.delete("/:id", isAdmin, getSpecificUser, userController.delete)

router.post("/login", userController.login)

export default router