import { Messages } from "../helpers/messages.js"
import { respSC } from "../helpers/response.js";
import { readProjectData, removeProjectData, writeProjectData } from "../helpers/fileHelper.js"
import { HandledRespError, resErrCatch } from "../helpers/errorThrow.js";
import { Project } from "../config.js";

const projectController = {
  readAllProjects: async ( req, res ) => {
    try {
      const userInfo = await res.userInfo
      const allProjects = await Project.find({
        user_id: userInfo._id
      }).lean()

      if ( ! allProjects ) throw new HandledRespError(404, Messages.noData)

      await Promise.all( allProjects.map( async projectInfo => {
        return projectInfo.data = await projectController._readProjectDataFromFile(projectInfo._id)
      } ))

      return res.status(200).json(respSC(allProjects))
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  createProject: async ( req, res ) => {
    const body = req.body
    const data = {}

    if ( body.title ) data.title = body.title

    try {
      const userInfo = await res.userInfo

      const createdProject = await projectController._saveNewProjectByUserID(userInfo._id, data)
      
      let projectData = {}
      if ( body.data ) projectData = body.data
      await writeProjectData(createdProject._id, projectData)

      return res.status(200).json( respSC( createdProject, 200, Messages.itemCreated.replace(":item", "Project") ) )
    } catch (err) {
      return resErrCatch(res, err)
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
      const projectInfo = await Project.findById(projectID).lean()

      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))

      projectInfo.data = await projectController._readProjectDataFromFile(projectInfo._id)

      return res.status(200).json(respSC(projectInfo))
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  updateProject: async ( req, res ) => {
    const projectID = req.params.id
    const body = req.body

    try {
      const projectInfo = await Project.findById(projectID)

      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))
      
      if ( body.title ) projectInfo.title = body.title

      const updatedProject = await projectInfo.save()

      if ( body.data ) {
        await writeProjectData(updatedProject._id, body.data)
        updatedProject.data = body.data
      }


      return res.status(200).json( respSC( updatedProject, 200, Messages.itemUpdated.replace(":item", "Project") ) )
    } catch (err) {
      return resErrCatch(res, err)
    }
  },

  deleteProject: async ( req, res ) => {
    const projectID = req.params.id

    try {
      const projectInfo = await Project.findById(projectID)

      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))

      await removeProjectData(projectInfo._id)
      await projectInfo.remove()

      return res.status(200).json(respSC(projectInfo))
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  _readProjectDataFromFile: async (projectID) => {
    try {
      const data = await readProjectData(projectID)
      
      return JSON.parse(data.toString())
    } catch(err) {
      throw err
    }
  }
}

export default projectController