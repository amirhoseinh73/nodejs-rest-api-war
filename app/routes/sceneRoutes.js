import express from "express"
import sceneController from "../controllers/sceneController.js"
import isAuth from "../middlewares/isAuth.js"
import { imageUpload, videoUpload, zipUpload } from "../middlewares/fileUpload.js"

const router = express.Router()

router.post("/", isAuth, sceneController.create)
router.get("/:id", isAuth, sceneController.read)
router.patch("/:id", isAuth, sceneController.update)
router.delete("/:id", isAuth, sceneController.delete)

router.patch("/upload/image/:id", isAuth, imageUpload.single("image"), sceneController.uploadImage)
router.patch("/upload/video/:id", isAuth, videoUpload.single("video"), sceneController.uploadVideo)
router.patch("/upload/zip/:id", isAuth, zipUpload.single("zip"), sceneController.uploadZip)

export default router