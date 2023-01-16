import { Messages } from "../helpers/messages.js"
import Project from "../models/ProjectModel.js"
import { respER, respSC } from "../middlewares/response.js";
import { createUserProjectPaths, getProjectDataPath, getProjectPath, readJsonFileByPath, removeProjectDIR, writeJsonFileByPath } from "../helpers/ProjectHelper.js"
import { HandledRespError } from "../helpers/errorThrow.js";

const projectController = {
  readAllProjects: async ( req, res ) => {
    try {
      const userInfo = await res.userInfo
      const allProjects = await Project.find({
        user_id: userInfo._id
      }).lean()

      if ( ! allProjects ) throw new HandledRespError(404, Messages.noData)

      return res.status(200).json(respSC(allProjects))
    } catch(err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  createProject: async ( req, res ) => {
    const body = req.body
    const data = {}

    if ( body.title ) data.title = body.title
    // if ( body.scale ) data.scale = JSON.stringify(body.scale)

    try {
      const userInfo = await res.userInfo

      const createdProject = await projectController._saveNewProjectByUserID(userInfo._id, data)
      
      const createdPaths = createUserProjectPaths(userInfo._id, createdProject._id)
      if ( ! createdPaths ) throw new HandledRespError(500, Messages.pathCreateFailed)

      let projectData = {}
      if ( body.data ) projectData = body.data
      await projectController._writeProjectData(userInfo._id, createdProject._id, projectData)

      return res.status(200).json( respSC( createdProject, 200, Messages.itemCreated.replace(":item", "Project") ) )
    } catch (err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  _saveNewProjectByUserID: async (userID, data = {}) => {
    try {
      const newProjectData = {
        user_id: userID,
        ...data
      }
      const newProject = new Project(newProjectData)
  
      return await newProject.save()
    } catch {
      return new HandledRespError()
    }
  },

  readProject: async ( req, res ) => {
    const projectID = req.params.id

    try {
      const userInfo = await res.userInfo
      const projectInfo = await Project.findById(projectID).lean()

      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))

      projectInfo.data = await projectController._readProjectDataFromFile(userInfo._id, projectInfo._id)

      return res.status(200).json(respSC(projectInfo))
    } catch(err) {
      console.log(err);
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  updateProject: async ( req, res ) => {
    const projectID = req.params.id
    const body = req.body

    try {
      const userInfo = await res.userInfo
      const projectInfo = await Project.findById(projectID)

      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))
      
      if ( body.title ) projectInfo.title = body.title
      if ( body.scale ) projectInfo.scale = JSON.stringify(body.scale)

      const updatedProject = await projectInfo.save()

      if ( body.data ) {
        await projectController._writeProjectData(userInfo._id, updatedProject._id, body.data)
        updatedProject.data = body.data
      }


      return res.status(200).json( respSC( updatedProject, 200, Messages.itemUpdated.replace(":item", "Project") ) )
    } catch (err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  deleteProject: async ( req, res ) => {
    const projectID = req.params.id

    try {
      const userInfo = await res.userInfo
      const projectInfo = await Project.findById(projectID)

      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))

      const projectPath = getProjectPath(userInfo._id, projectInfo._id)

      await removeProjectDIR(projectPath)
      await projectInfo.remove()

      return res.status(200).json(respSC(projectInfo))
    } catch(err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  _writeProjectData: async (userID, projectID, projectData) => {
    try {
      const filepath = getProjectDataPath(userID, projectID)
      await writeJsonFileByPath(filepath, projectData)
      
      return true
    } catch( err ) {
      throw err
    }
  },

  _readProjectDataFromFile: async (userID, projectID) => {
    try {
      const filepath = getProjectDataPath(userID, projectID)
      const data = await readJsonFileByPath(filepath)
      
      return JSON.parse(data.toString())
    } catch( err ) {
      throw err
    }
  }
}

export default projectController