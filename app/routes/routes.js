import express from 'express';
import userRoutes from "./userRoutes.js";
import { app } from '../config.js';

app.use( express.json() )

app.use( "/users", userRoutes )