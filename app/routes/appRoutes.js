import { router } from "../config.js"
import appController from "../controllers/appController.js"
import isAuth from "../middlewares/isAuth.js"

router.post("/save/path/:name", isAuth, appController.createProjectPath)

export default router