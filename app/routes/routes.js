import express from 'express';
import userRoutes from "./users.js";
import { app } from '../config.js';

app.use( express.json() )

app.use( "/users", userRoutes )