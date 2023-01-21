import express from "express"
import sceneController from "../controllers/sceneController.js"
import isAuth from "../middlewares/isAuth.js"
import { uploadImage } from "../middlewares/fileUpload.js"

const router = express.Router()

router.post("/", isAuth, sceneController.create)
router.get("/:id", isAuth, sceneController.read)
router.patch("/:id", isAuth, sceneController.update)
router.delete("/:id", isAuth, sceneController.delete)

router.patch("/upload/image/:id", isAuth, uploadImage.single("image"), sceneController.uploadImage)

export default router