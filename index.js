import express from "express";
import { app, PORT } from "./app/config.js";
import { dbConnection } from "./app/DB.js"
import userRoutes from "./app/routes/userRoutes.js";
import appRoutes from "./app/routes/appRoutes.js"

dbConnection()

app.listen( PORT, () => console.log( `server started ${PORT}` ) )

app.use( express.json() )

app.use( "/api/users", userRoutes )

app.use( "/api/app", appRoutes )