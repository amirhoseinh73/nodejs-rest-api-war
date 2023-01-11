import dotenv from 'dotenv';
import express from "express"
import { fileURLToPath } from 'url';
import path from "path"
import bodyParser from "body-parser"

dotenv.config()

export const app = express()

export const router = express.Router()

app.use( bodyParser.json({
  limit: '5000mb'
}));

app.use( bodyParser.urlencoded({
  limit: '5000mb',
  // parameterLimit: 100000,
  extended: true
}));

export const APP_PORT = process.env.APP_PORT || 3000

export const DB_URL = process.env.DB_URL || ""

export const JWT_SECRET = process.env.JWT_SECRET || ""

export const jwt_blacklist = []

export const __filename__ = fileURLToPath(import.meta.url);
export const __dirname__ = path.dirname(__filename__);

export const __dir_projects__ = `${__dirname__}/../uploads/projects`

export const __subdir_projects__ = {
  "images"    : "images",
  "models"    : "models",
  "targets"   : "targets",
  "videos"    : "videos",
  // "projects"  : "projects",
  // "positions" : "positions",
  // "scales"    : "scales",
  // "active_target_names" : "active_target_names",
}

export const __scene_data_file_name_ = "scene-data.json"
