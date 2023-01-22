import dotenv from 'dotenv'
import express from "express"
import { fileURLToPath } from 'url'
import path from "path"

dotenv.config()

export const app = express()

export const router = express.Router()

export const APP_PORT = process.env.APP_PORT || 3000

export const DB_URL = process.env.DB_URL || ""

export const APP_URL = process.env.APP_URL || ""

export const JWT_SECRET = process.env.JWT_SECRET || ""

export const jwt_blacklist = []

export const __filename__ = fileURLToPath(import.meta.url);
export const __dirname__ = path.dirname(__filename__);

export const __dir_projects__ = `${__dirname__}/../data/projects`
export const __dir_scenes__   = `${__dirname__}/../data/scenes`

export const __dir_tmp__   = `${__dirname__}/../public/uploads/tmp`

export const __dir_images__   = `${__dirname__}/../public/uploads/images`
export const __dir_videos__   = `${__dirname__}/../public/uploads/videos`
export const __dir_models__   = `${__dirname__}/../public/uploads/models`
export const __dir_zips__     = `${__dirname__}/../public/uploads/zips`
export const __dir_targets__  = `${__dirname__}/../public/uploads/targets`

export const uploadURLS = {
  images: "uploads/images",
  videos: "uploads/videos",
  models: "uploads/models",
  zips: "uploads/zips",
  targets: "uploads/targets"
}

export const AVAILABLE_IMAGE_FORMATS  = ["image/jpg", "image/jpeg", "image/png", "image/gif"]
export const AVAILABLE_VIDEO_FORMATS  = ["video/mp4"]
export const AVAILABLE_ZIP_FORMATS    = ["application/zip"]