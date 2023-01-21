import { Messages } from "../helpers/messages.js"
import { respSC } from "../helpers/response.js";
import { readSceneData, removeFile, removeSceneData, writeSceneData } from "../helpers/fileHelper.js"
import { HandledRespError, resErrCatch } from "../helpers/errorThrow.js";
import { AVAILABLE_IMAGE_FORMATS, AVAILABLE_VIDEO_FORMATS, __dir_images__, __dir_targets__, __dir_videos__ } from "../config.js";
import { Project, Scene } from "../config.js";

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
      return resErrCatch(res, err)
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
      if ( req.files && req.files.target ) data.target = this._saveUploadedFile(req.files.target, __dir_targets__)

      const newScene = new Scene(data)
      const createdScene = await newScene.save()
      
      let sceneData = {}
      if ( body.data ) sceneData = body.data
      await writeSceneData(createdScene._id, sceneData)

      return res.status(200).json( respSC( createdScene, 200, Messages.itemCreated.replace(":item", "Scene") ) )
    } catch(err) {
      return resErrCatch(res, err)
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
      return resErrCatch(res, err)
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
        data.target = this._saveUploadedFile(req.files.target, __dir_targets__)
      }

      const updatedScene = await sceneInfo.save()

      if ( body.data ) {
        await writeSceneData(updatedScene._id, body.data)
        updatedScene.data = body.data
      }

      return res.status(200).json( respSC( updatedScene, 200, Messages.itemUpdated.replace(":item", "Scene") ) )
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  delete = async ( req, res ) => {
    const sceneID = req.params.id

    try {
      const sceneInfo = await Scene.findById(sceneID)

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      await this._removeFiles(sceneInfo)
      await sceneInfo.remove()

      return res.status(200).json(respSC(sceneInfo))
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  _removeFiles = async (sceneInfo) => {
    try {
      if (sceneInfo.target) await removeFile(sceneInfo.target)
      if (sceneInfo.images) this._removeUploadedFiles(sceneInfo.images, __dir_images__)
      if (sceneInfo.videos) this._removeUploadedFiles(sceneInfo.videos, __dir_videos__)

      await removeSceneData(sceneInfo._id)
    } catch(err) {
      throw err
    }
  }

  _removeUploadedFiles = (items, dir) => {
    items.forEach(async item => {
      await removeFile(`${dir}/${item}`)
    });
  }

  uploadImage = async ( req, res ) => {
    const sceneID = req.params.id
    try {
      const sceneInfo = await Scene.findById(sceneID)
      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      const uploadedFile = this._uploadFiles(req.file, sceneInfo.upload_size, sceneInfo.images, AVAILABLE_IMAGE_FORMATS)

      sceneInfo.upload_size = uploadedFile.newSize
      sceneInfo.images = uploadedFile.items

      const updatedScene = await sceneInfo.save()

      return res.status(200).json( respSC( updatedScene, 200, Messages.itemCreated.replace(":item", "Image") ) )
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  uploadVideo = async ( req, res ) => {
    const sceneID = req.params.id
    try {
      const sceneInfo = await Scene.findById(sceneID)
      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))
      
      const uploadedFile = this._uploadFiles(req.file, sceneInfo.upload_size, sceneInfo.videos, AVAILABLE_VIDEO_FORMATS)

      sceneInfo.upload_size = uploadedFile.newSize
      sceneInfo.videos = uploadedFile.items

      const updatedScene = await sceneInfo.save()

      return res.status(200).json( respSC( updatedScene, 200, Messages.itemCreated.replace(":item", "Video") ) )
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  _uploadFiles = (file, oldSize, items, AVAILABLE_FORMATS) => {
    try {
      const fileMimeType = file.mimetype
      const fileSize = file.size
      const fileCurrentName = file.filename

      if ( ! AVAILABLE_FORMATS.includes(fileMimeType) ) throw new HandledRespError(406)

      items.push(fileCurrentName)

      oldSize = oldSize || 0
      const newSize = (Number(oldSize) + (fileSize/1024)).toFixed(2)

      return {items, newSize}
    } catch(err) {
      throw err
    }
  }
}

export default new sceneController()