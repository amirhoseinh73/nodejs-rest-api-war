import { Messages } from "../helpers/messages.js"
import { respSC } from "../helpers/response.js";
import { readSceneData, removeDIR, removeFile, removeSceneData, writeSceneData } from "../helpers/fileHelper.js"
import { HandledRespError, resErrCatch } from "../helpers/errorThrow.js";
import { APP_URL, AVAILABLE_IMAGE_FORMATS, AVAILABLE_VIDEO_FORMATS, AVAILABLE_ZIP_FORMATS, __dir_images__, __dir_models__, __dir_targets__, __dir_tmp__, __dir_videos__, __dir_zips__, uploadURLS } from "../config.js";
import { Project, Scene } from "../models/parentModel.js"
import AdmZip from "adm-zip";
import { promises as fsPromises } from "fs";

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
      let sceneInfo = await Scene.findById(sceneID).lean()
      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      // handle file urls
      sceneInfo = this._handleUploadedFilesURL(sceneInfo)

      sceneInfo.data = await this._readSceneDataFromFile(sceneInfo._id)

      return res.status(200).json(respSC(sceneInfo))
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  _handleUploadedFilesURL = (sceneInfo) => {
    if (sceneInfo.images) sceneInfo.images = sceneInfo.images.map(image => `${APP_URL}/${uploadURLS.images}/${image}`)
    if (sceneInfo.videos) sceneInfo.videos = sceneInfo.videos.map(video => `${APP_URL}/${uploadURLS.videos}/${video}`)
    if (sceneInfo.models) sceneInfo.models = sceneInfo.models.map(model => `${APP_URL}/${uploadURLS.models}/${model}`)

    return sceneInfo
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
      if (sceneInfo.models) this._removeModelFiles(sceneInfo.models)

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

  _removeModelFiles = (items) => {
    items.forEach(async item => {
      await removeDIR(`${__dir_models__}/${item}`)
      await removeFile(`${__dir_zips__}/${item}.zip`)
    })
  }

  _acceptUploadedFiles = (file, AVAILABLE_FORMATS) => {
    try {
      const fileMimeType = file.mimetype

      if ( ! AVAILABLE_FORMATS.includes(fileMimeType) ) throw new HandledRespError(406)

      return true
    } catch(err) {
      throw err
    }
  }

  _moveUploadedFiles = async (path, fileCurrentName) => {
    try {
      const oldPath = `${__dir_tmp__}/${fileCurrentName}`
      const newPath = `${path}/${fileCurrentName}`
      await fsPromises.rename(oldPath, newPath)

      return true
    } catch(err) {
      throw err
    }
  }

  _handleUploadedFileSize = (fileSize, oldSize) => {
    try {
      oldSize = Number(oldSize) || 0
      const newSize = Number((oldSize + (fileSize/1024)).toFixed(2))

      return newSize
    } catch(err) {
      throw err
    }
  }

  uploadImage = async ( req, res ) => {
    const sceneID = req.params.id
    try {
      const sceneInfo = await Scene.findById(sceneID)
      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      const file = req.file
      this._acceptUploadedFiles(file, AVAILABLE_IMAGE_FORMATS)
      await this._moveUploadedFiles(__dir_images__, file.filename)

      const newUploadedSize = this._handleUploadedFileSize(file.size, sceneInfo.upload_size)
      sceneInfo.upload_size = newUploadedSize

      sceneInfo.images.push(file.filename)

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
      
      const file = req.file
      this._acceptUploadedFiles(file, AVAILABLE_VIDEO_FORMATS)
      await this._moveUploadedFiles(__dir_videos__, file.filename)

      const newUploadedSize = this._handleUploadedFileSize(file.size, sceneInfo.upload_size)
      sceneInfo.upload_size = newUploadedSize

      sceneInfo.videos.push(file.filename)

      const updatedScene = await sceneInfo.save()

      return res.status(200).json( respSC( updatedScene, 200, Messages.itemCreated.replace(":item", "Video") ) )
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  uploadZip = async ( req, res ) => {
    const sceneID = req.params.id
    try {
      const sceneInfo = await Scene.findById(sceneID)
      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      const file = req.file
      this._acceptUploadedFiles(file, AVAILABLE_ZIP_FORMATS)
      await this._moveUploadedFiles(__dir_zips__, file.filename)

      const newUploadedSize = this._handleUploadedFileSize(file.size, sceneInfo.upload_size)
      sceneInfo.upload_size = newUploadedSize

      const fileCurrentName = String(file.filename).split(".")[0]
      sceneInfo.models.push(`${fileCurrentName}/scene.gltf`)

      const currentZip = new AdmZip(`${__dir_zips__}/${file.filename}`);
      currentZip.extractAllTo(`${__dir_models__}/${fileCurrentName}`, true);

      const updatedScene = await sceneInfo.save()

      return res.status(200).json( respSC( updatedScene, 200, Messages.itemCreated.replace(":item", "Zip") ) )
    } catch(err) {
      return resErrCatch(res, err)
    }
  }

  
}

export default new sceneController()