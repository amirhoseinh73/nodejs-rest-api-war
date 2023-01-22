import express from "express"
import { __dirname__, app, APP_PORT } from "./app/config.js"
import { dbConnection } from "./app/DB.js"
import userRoutes from "./app/routes/userRoutes.js"
import projectRoutes from "./app/routes/projectRoutes.js"
import sceneRoutes from "./app/routes/sceneRoutes.js"
import { Messages } from "./app/helpers/messages.js"
import bodyParser from "body-parser"
import path from "path"
// import listEndpoints from "express-list-endpoints"

dbConnection()

app.use( express.json() )

//routes
app.use( "/api/user", userRoutes )
app.use( "/api/project", projectRoutes )
app.use( "/api/scene", sceneRoutes )

app.use( bodyParser.json({ // application/json
  limit: '5000mb'
}));

app.use( bodyParser.urlencoded({ // x-www-form-urn-encoded
  limit: '5000mb',
  extended: true
}));

// app.use(multer().array()) // multipart/formdata

app.use(express.static(path.join(__dirname__, '../public')));

app.listen( APP_PORT, () => {
  console.log( Messages.serverRuning )
  // console.log(listEndpoints(app));
} )