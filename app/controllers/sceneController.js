import { Messages } from "../helpers/messages.js"
import Scene from "../models/SceneModel.js"
import { respER, respSC } from "../middlewares/response.js";
import { createUserScenePaths, getSceneDataPath, getScenePath, readJsonFileByPath, removeSceneDIR, writeJsonFileByPath } from "../helpers/sceneHelper.js"
import { HandledRespError } from "../helpers/errorThrow.js";

const sceneController = {
  readAllScenes: async ( req, res ) => {
    try {
      const userInfo = await res.userInfo
      const allScenes = await Scene.find({
        user_id: userInfo._id
      }).lean()

      if ( ! allScenes ) throw new HandledRespError(404, Messages.noData)

      return res.status(200).json(respSC(allScenes))
    } catch(err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  createScene: async ( req, res ) => {
    const body = req.body
    const data = {}

    if ( body.title ) data.title = body.title
    // if ( body.scale ) data.scale = JSON.stringify(body.scale)

    try {
      const userInfo = await res.userInfo

      const createdScene = await sceneController._saveNewSceneByUserID(userInfo._id, data)
      
      const createdPaths = createUserScenePaths(userInfo._id, createdScene._id)
      if ( ! createdPaths ) throw new HandledRespError(500, Messages.pathCreateFailed)

      let sceneData = {}
      if ( body.data ) sceneData = body.data
      await sceneController._writeSceneData(userInfo._id, createdScene._id, sceneData)

      return res.status(200).json( respSC( createdScene, 200, Messages.itemCreated.replace(":item", "scene") ) )
    } catch (err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  _saveNewSceneByUserID: async (userID, data = {}) => {
    try {
      const newSceneData = {
        user_id: userID,
        ...data
      }
      const newScene = new Scene(newSceneData)
  
      return await newScene.save()
    } catch {
      return new HandledRespError()
    }
  },

  readScene: async ( req, res ) => {
    const sceneID = req.params.id

    try {
      const userInfo = await res.userInfo
      const sceneInfo = await Scene.findById(sceneID).lean()

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      sceneInfo.data = await sceneController._readSceneDataFromFile(userInfo._id, sceneInfo._id)

      return res.status(200).json(respSC(sceneInfo))
    } catch(err) {
      console.log(err);
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  updateScene: async ( req, res ) => {
    const sceneID = req.params.id
    const body = req.body

    try {
      const userInfo = await res.userInfo
      const sceneInfo = await Scene.findById(sceneID)

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))
      
      if ( body.title ) sceneInfo.title = body.title
      if ( body.scale ) sceneInfo.scale = JSON.stringify(body.scale)

      const updatedScene = await sceneInfo.save()

      if ( body.data ) {
        await sceneController._writeSceneData(userInfo._id, updatedScene._id, body.data)
        updatedScene.data = body.data
      }


      return res.status(200).json( respSC( updatedScene, 200, Messages.itemUpdated.replace(":item", "scene") ) )
    } catch (err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  deleteScene: async ( req, res ) => {
    const sceneID = req.params.id

    try {
      const userInfo = await res.userInfo
      const sceneInfo = await Scene.findById(sceneID)

      if ( ! sceneInfo ) throw new HandledRespError(404, Messages.itemNotFound.replace(":item", "Scene"))

      const scenePath = getScenePath(userInfo._id, sceneInfo._id)

      await removeSceneDIR(scenePath)
      await sceneInfo.remove()

      return res.status(200).json(respSC(sceneInfo))
    } catch(err) {
      return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
    }
  },

  _writeSceneData: async (userID, sceneID, sceneData) => {
    try {
      const filepath = getSceneDataPath(userID, sceneID)
      await writeJsonFileByPath(filepath, sceneData)
      
      return true
    } catch( err ) {
      throw err
    }
  },

  _readSceneDataFromFile: async (userID, sceneID) => {
    try {
      const filepath = getSceneDataPath(userID, sceneID)
      const data = await readJsonFileByPath(filepath)
      
      return JSON.parse(data.toString())
    } catch( err ) {
      throw err
    }
  }
}

export default sceneController