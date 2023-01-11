import { router } from "../config.js"
import sceneController from "../controllers/sceneController.js"
import isAuth from "../middlewares/isAuth.js"

router.get("/", isAuth, sceneController.readAllScenes)

router.post("/", isAuth, sceneController.createScene)
router.get("/:id", isAuth, sceneController.readScene)
router.patch("/:id", isAuth, sceneController.updateScene)
router.delete("/:id", isAuth, sceneController.deleteScene)

router.post("/save/data/:id", isAuth, sceneController.createSceneData);
router.get("/read/data/:id", isAuth, sceneController.readSceneData);

// router.get("/read/scale/:id", isAuth, sceneController.readScaleData);
// router.post("/save/scale/:id", isAuth, sceneController.saveScaleData);

export default router