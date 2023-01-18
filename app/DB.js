import mongoose from "mongoose"
import { DB_URL } from "./config.js"
import { Messages } from "./helpers/messages.js"
import User from "./models/userModel.js"
import Project from "./models/projectModel.js"
import Scene from "./models/sceneModel.js"

export const dbConnection = () => {
  mongoose.set('strictQuery', false)
  mongoose.connect( DB_URL )
  const DB = mongoose.connection
  DB.on( "error", (err) => console.error(err) )
  DB.once( "open", () => console.log( Messages.connectedDB ) )
}

export {User, Project, Scene}