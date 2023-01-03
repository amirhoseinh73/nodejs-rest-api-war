import { dbConnection } from './DB';
import express from "express"

dbConnection()

const app = express()

app.listen( 4000, () => console.log( "server started 4000" ) )