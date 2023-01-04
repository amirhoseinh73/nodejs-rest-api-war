import { router } from "../config.js"
import userController from "../controllers/userController.js"
import getUser from "../middlewares/getUser.js"

// get all users
router.get("/", userController.list)

// get user
router.get("/:id", getUser, userController.findOne)

// create user
router.post("/", userController.create)

// update user
// patch only update passed information to request
// put update all information of user instead of the information passed
router.patch("/:id", getUser, userController.update)

// delete user
router.delete("/:id", getUser, userController.delete)

export default router