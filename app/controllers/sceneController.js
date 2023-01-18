import { v4 as uuidv4 } from "uuid"
import { Messages } from "../helpers/messages.js"
import { respER, respSC } from "../helpers/response.js";
import { readSceneData, removeFile, removeSceneData, writeSceneData } from "../helpers/fileHelper.js"
import { HandledRespError } from "../helpers/errorThrow.js";
import { __dir_targets__ } from "../config.js";
import { Project, Scene } from "../DB.js";

class sceneController {
  readAll = async ( req, res ) => {
    const projectID = req.params.id
    try {
      const projectInfo = await Project.findById(projectID).lean()
      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Project"))

      const allScenes = await Scene.find({
        project_id: projectID
      }).lean()

      if ( ! allScenes ) throw new HandledRespError(404, Messages.noData)

      await Promise.all( allScenes.map( async sceneInfo => {
        return sceneInfo.data = await this._readSceneDataFromFile(sceneInfo._id)
      } ))

      return res.status(200).json(respSC(allScenes))
    } catch(err) {
      if ( ! err.statusCode ) err.statusCode = 500
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  }

  _readSceneDataFromFile = async (sceneID) => {
    try {
      const data = await readSceneData(sceneID)
      
      return JSON.parse(data.toString())
    } catch(err) {
      throw err
    }
  }

  create = async ( req, res ) => {
    const body = req.body
    try {
      if ( ! body.project_id ) throw new HandledRespError(400)

      const data = {project_id: body.project_id}

      const projectInfo = await Project.findById(data.project_id).lean()
      if ( ! projectInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "project"))

      if ( body.title ) data.title = body.title
      if ( req.files && req.files.target ) data.target = this._saveUploadedTarget(req.files.target)

      const newScene = new Scene(data)
      const createdScene = await newScene.save()
      
      let sceneData = {}
      if ( body.data ) sceneData = body.data
      await writeSceneData(createdScene._id, sceneData)

      return res.status(200).json( respSC( createdScene, 200, Messages.itemCreated.replace(":item", "Scene") ) )
    } catch(err) {
      if ( ! err.statusCode ) err.statusCode = 500
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  }

  _saveUploadedTarget = ( file ) => {
    let error = false
    const userFileName = file.name
    const fileFormat = file.mimetype
    const newFileName = uuidv4() + userFileName

    try {
      file.mv(__dir_targets__, (err) => error = err )
    
      console.table(file)

      if ( ! error ) return newFileName
      throw new HandledRespError(500, error)
    } catch(err) {
      throw err
    }
  }

  read = async ( req, res ) => {
    const sceneID = req.params.id

    try {
      const sceneInfo = await Scene.findById(sceneID).lean()

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      sceneInfo.data = await this._readSceneDataFromFile(sceneInfo._id)

      return res.status(200).json(respSC(sceneInfo))
    } catch(err) {
      if ( ! err.statusCode ) err.statusCode = 500
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  }

  update = async ( req, res ) => {
    const sceneID = req.params.id
    const body = req.body

    try {
      const sceneInfo = await Scene.findById(sceneID)

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))
      
      if ( body.title ) sceneInfo.title = body.title
      if ( req.files && req.files.target ) {
        await removeFile(sceneInfo.target)
        data.target = this._saveUploadedTarget(req.files.target)
      }

      const updatedScene = await sceneInfo.save()

      if ( body.data ) {
        await writeSceneData(updatedScene._id, body.data)
        updatedScene.data = body.data
      }

      return res.status(200).json( respSC( updatedScene, 200, Messages.itemUpdated.replace(":item", "Scene") ) )
    } catch(err) {
      if ( ! err.statusCode ) err.statusCode = 500
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  }

  delete = async ( req, res ) => {
    const sceneID = req.params.id

    try {
      const sceneInfo = await Scene.findById(sceneID)

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      if (sceneInfo.target) await removeFile(sceneInfo.target)
      await removeSceneData(sceneInfo._id)
      await sceneInfo.remove()

      return res.status(200).json(respSC(sceneInfo))
    } catch(err) {
      if ( ! err.statusCode ) err.statusCode = 500
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  }
}

export default new sceneController()