import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export const dbConnection = () => {
  mongoose.set('strictQuery', false)
  const DB_URL = process.env.DB_URL || ""
  mongoose.connect( DB_URL )
  const DB = mongoose.connection
  DB.on( "error", (err) => console.error(err) )
  DB.once( "open", () => console.log( "Connected to DB" ) )
}