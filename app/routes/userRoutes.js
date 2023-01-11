import { router } from "../config.js"
import userController from "../controllers/userController.js"
import isAdmin from "../middlewares/isAdmin.js"
import isAuth from "../middlewares/isAuth.js"

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
router.delete("/", isAuth, userController.delete)

export default router