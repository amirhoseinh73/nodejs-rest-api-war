import dotenv from 'dotenv';
import express from "express"

export const app = express()

export const router = express.Router()

dotenv.config()