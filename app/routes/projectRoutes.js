import express from "express"
import projectController from "../controllers/projectController.js"
import isAuth from "../middlewares/isAuth.js"

const router = express.Router()

router.get("/", isAuth, projectController.readAllProjects)

router.post("/", isAuth, projectController.createProject)
router.get("/:id", isAuth, projectController.readProject)
router.patch("/:id", isAuth, projectController.updateProject)
router.delete("/:id", isAuth, projectController.deleteProject)

export default router