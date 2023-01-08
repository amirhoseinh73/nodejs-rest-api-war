import dotenv from 'dotenv';
import express from "express"

dotenv.config()

export const app = express()

export const router = express.Router()

export const PORT = 4000

export const JWT_SECRET = "!@#$%^&*()_+="

export const jwt_blacklist = []