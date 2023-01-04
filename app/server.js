import { app, PORT } from './config.js';
import { dbConnection } from './DB.js';
import "./routes/routes.js"

dbConnection()

app.listen( PORT, () => console.log( `server started ${PORT}` ) )