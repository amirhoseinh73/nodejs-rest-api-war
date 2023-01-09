import express from "express";
import { app, APP_PORT } from "./app/config.js";
import { dbConnection } from "./app/DB.js"
import userRoutes from "./app/routes/userRoutes.js";
import appRoutes from "./app/routes/appRoutes.js"
import { Messages } from "./app/helpers/messages.js";

dbConnection()

app.listen( APP_PORT, () => console.log( Messages.serverRuning ) )

app.use( express.json() )

app.use( "/api/users", userRoutes )

app.use( "/api/app", appRoutes )