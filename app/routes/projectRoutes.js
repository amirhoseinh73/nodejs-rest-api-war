import express from "express"
import projectController from "../controllers/projectController.js"
import isAuth from "../middlewares/isAuth.js"
import sceneController from "../controllers/sceneController.js"

const router = express.Router()

router.get("/", isAuth, projectController.readAllProjects)

router.post("/", isAuth, projectController.createProject)
router.get("/:id", isAuth, projectController.readProject)
router.patch("/:id", isAuth, projectController.updateProject)
router.delete("/:id", isAuth, projectController.deleteProject)

router.get("/list/scene/:id", isAuth, sceneController.readAll)

export default router