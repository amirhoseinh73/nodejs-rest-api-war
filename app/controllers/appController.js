import { Messages } from "../helpers/messages.js"
import Project from "../models/projectModel.js"
import { respER, respSC } from "../middlewares/response.js";
import path from "path"
import fs from "fs";
import { __dir_projects, __dirname, __subdir_projects } from "../config.js";

const createPaths = (userDIR, pathDIR) => {
  let flag = false

  // create user path by id
  if( ! fs.existsSync( userDIR ) ) fs.mkdir( userDIR, err => flag = err)
  fs.mkdir(pathDIR, err => flag = err)

  __subdir_projects.forEach( dir => {
    if (flag) return
    const subDIR = path.join( pathDIR, dir )

    fs.mkdir( subDIR, err => flag = err )
  } )

  if (flag) return false
  return true
}

const appController = {
  createProjectPath: async ( req, res ) => {
    let statusCode = 200
    const pathName = req.params.name

    try {
      const userInfo = await res.userInfo
      const checkExistPath = await Project.findOne({
        "name": pathName,
        "user_id": userInfo._id
      }).lean()

      if ( checkExistPath ) {
        statusCode = 409 //conflict
        return res.status(statusCode).json( respER( statusCode, Messages.pathDuplicate ) )
      }

      const userDIR = path.join(`${__dir_projects}/${userInfo._id}`)
      const pathDIR = path.join(`${__dir_projects}/${userInfo._id}/${pathName}`)

      const createdPaths = createPaths(userDIR, pathDIR)
      if ( ! createdPaths ) throw new Error( Messages.pathCreateFailed )

      const newProject = new Project({
        name: pathName,
        user_id: userInfo._id
      })
      const saveProject = await newProject.save()

      saveProject.pathDIR = pathDIR
      return res.status(statusCode).json( respSC( saveProject, statusCode, Messages.itemCreated.replace(":item", "path") ) )
    } catch (err) {
      statusCode = 500
      return res.status(statusCode).json( respER( statusCode, Messages.pathCreateFailed, pathName ) )
    }
  },
}

export default appController