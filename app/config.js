import dotenv from 'dotenv';
import express from "express"
import { fileURLToPath } from 'url';
import path from "path"

dotenv.config()

export const app = express()

export const router = express.Router()

export const APP_PORT = process.env.APP_PORT || 3000

export const DB_URL = process.env.DB_URL || ""

export const JWT_SECRET = process.env.JWT_SECRET || ""

export const jwt_blacklist = []

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const __dir_projects = `${__dirname}/../uploads/projects`
export const __subdir_projects = {
  "images"    : "images",
  "models"    : "models",
  "projects"  : "projects",
  "positions" : "positions",
  "scales"    : "scales",
  "targets"   : "targets",
  "videos"    : "videos",
  "active_target_names" : "active_target_names",
}
export const __dir_scene_data_ = "scene-data.json"
