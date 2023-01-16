import express from "express"
import { app, APP_PORT } from "./app/config.js"
import { dbConnection } from "./app/DB.js"
import userRoutes from "./app/routes/userRoutes.js"
import sceneRoutes from "./app/routes/sceneRoutes.js"
import { Messages } from "./app/helpers/messages.js"
// import listEndpoints from "express-list-endpoints"

dbConnection()

app.use( express.json() )

//routes
app.use( "/api/users", userRoutes )
app.use( "/api/scene", sceneRoutes )

app.listen( APP_PORT, () => {
  console.log( Messages.serverRuning )
  // console.log(listEndpoints(app));
} )