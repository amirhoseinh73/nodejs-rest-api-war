import { router } from "../config.js"
import sceneController from "../controllers/sceneController.js"
import isAuth from "../middlewares/isAuth.js"

router.post("/save/path/:name", isAuth, sceneController.createProjectPath)

router.get("/read/data/:id", isAuth, sceneController.readSceneData);
router.post("/save/data/:id", isAuth, sceneController.saveSceneData);

export default router