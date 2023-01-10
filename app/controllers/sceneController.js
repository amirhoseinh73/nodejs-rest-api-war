import { Messages } from "../helpers/messages.js"
import Project from "../models/projectModel.js"
import { respER, respSC } from "../middlewares/response.js";
import { createUserScenePaths, getScenDataPath, readJsonFileByPath, writeJsonFileByPath } from "../helpers/sceneHelper.js"
import { HandledRespError } from "../helpers/errorThrow.js";

const sceneController = {
  _selectProjectByNameAndUserID: async (pathName, userID) => {
    return await Project.findOne({
      "name": pathName,
      "user_id": userID
    }).lean()
  },

  _saveNewProjectByNameAndUserID: async (pathName, userID) => {
    const newProject = new Project({
      name: pathName,
      user_id: userID
    })

    return await newProject.save()
  },

  createProjectPath: async ( req, res ) => {
    const pathName = req.params.name

    try {
      const userInfo = await res.userInfo
      const checkExistPath = await sceneController._selectProjectByNameAndUserID(pathName, userInfo._id)

      if ( checkExistPath ) throw new HandledRespError(409, Messages.pathDuplicate)

      const createdPaths = createUserScenePaths( pathName, userInfo._id)
      if ( ! createdPaths ) throw new HandledRespError(500, Messages.pathCreateFailed)

      const saveProject = await sceneController._saveNewProjectByNameAndUserID(pathName, userInfo._id)

      saveProject.pathDIR = createdPaths
      return res.status(200).json( respSC( saveProject, 200, Messages.itemCreated.replace(":item", "path") ) )
    } catch (err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message, pathName) )
    }
  },

  readSceneData: async (req, res) => {
    const projectID =  req.params.id

    try {
      const userInfo = await res.userInfo
      const projectInfo = await Project.findById(projectID)
      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "project"))

      const filepath = getScenDataPath(userInfo._id, projectInfo.name)
      const data = await readJsonFileByPath(filepath)
      if( ! data ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "data"))
      
      const parsedData = JSON.parse(data.toString())

      return res.status(200).json(respSC(parsedData))
    } catch( err ) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  saveSceneData: async (req, res) => {
    const projectID = req.params.id
    const sceneData = req.body.data

    try {
      if ( ! sceneData ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "data"))

      const userInfo = await res.userInfo
      const projectInfo = await Project.findById(projectID).lean()
      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "project"))

      const filepath = getScenDataPath(userInfo._id, projectInfo.name)

      try {
        await writeJsonFileByPath(filepath, sceneData)
      } catch {
        throw new HandledRespError()
      }
      
      return res.status(200).json( respSC() )
    } catch( err ) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  }
}

export default sceneController