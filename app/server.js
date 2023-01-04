import { app } from './config.js';
import { dbConnection } from './DB.js';
import "./routes/routes.js"

dbConnection()

app.listen( 4000, () => console.log( "server started 4000" ) )