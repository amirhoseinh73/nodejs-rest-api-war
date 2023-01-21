import dotenv from 'dotenv'
import express from "express"
import { fileURLToPath } from 'url'
import path from "path"
import bodyParser from "body-parser"
import multer from "multer";
import User from "./models/userModel.js"
import Project from "./models/projectModel.js"
import Scene from "./models/sceneModel.js"

dotenv.config()

export const app = express()

export const router = express.Router()

app.use( bodyParser.json({
  limit: '5000mb'
}));

app.use( bodyParser.urlencoded({
  limit: '5000mb',
  extended: true
}));

// app.use(multer().array())

export const APP_PORT = process.env.APP_PORT || 3000

export const DB_URL = process.env.DB_URL || ""

export const JWT_SECRET = process.env.JWT_SECRET || ""

export const jwt_blacklist = []

export const __filename__ = fileURLToPath(import.meta.url);
export const __dirname__ = path.dirname(__filename__);

export const __dir_projects__ = `${__dirname__}/../uploads/data/projects`
export const __dir_scenes__ = `${__dirname__}/../uploads/data/scenes`

export const __dir_images__ = `${__dirname__}/../uploads/images`
export const __dir_models__ = `${__dirname__}/../uploads/models`
export const __dir_targets__ = `${__dirname__}/../uploads/targets`
export const __dir_videos__ = `${__dirname__}/../uploads/videos`

export {User, Project, Scene}

export const AVAILABLE_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"]