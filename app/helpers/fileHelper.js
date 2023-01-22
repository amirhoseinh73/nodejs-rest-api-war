import { __dir_projects__, __dir_scenes__ } from "../config.js"
import { promises as fsPromises } from "fs";
import fs from "fs";
import { HandledRespError } from "./errorThrow.js";

export const getProjectDataPath = (projectID) => `${__dir_projects__}/${projectID}.json`
export const getSceneDataPath = (sceneID) => `${__dir_scenes__}/${sceneID}.json`

export const readJsonFileByPath = async (path) => {
  try {
    return await fsPromises.readFile(path);
  } catch {
    throw new HandledRespError() // inner try catch
  }
}

export const readProjectData = async (projectID) => {
  const projectPath = getProjectDataPath(projectID)
  try {
    return await readJsonFileByPath(projectPath)
  } catch(err) {
    throw err
  }
}

export const readSceneData = async (sceneID) => {
  const scenePath = getSceneDataPath(sceneID)
  try {
    return await readJsonFileByPath(scenePath)
  } catch(err) {
    throw err
  }
}

export const writeJsonFileByPath = async (path, data) => {
  try {
    return await fsPromises.writeFile(path, JSON.stringify(data));
  } catch {
    throw new HandledRespError() // inner try catch
  }
}

export const writeProjectData = async (projectID, data) => {
  const projectPath = getProjectDataPath(projectID)
  try {
    return await writeJsonFileByPath(projectPath, data)
  } catch(err) {
    throw err
  }
}

export const writeSceneData = async (sceneID, data) => {
  const scenePath = getSceneDataPath(sceneID)
  try {
    return await writeJsonFileByPath(scenePath, data)
  } catch(err) {
    throw err
  }
}

export const removeDIR = async (pathName) => {
  try {
    fs.rmSync(pathName, {
      recursive: true,
      force: true
    })
    return await fsPromises.rm(pathName, {
      recursive: true,
      force: true
    })
  } catch(err) {
    throw new HandledRespError() // inner try catch
  }
}

export const removeFile = async (fileName) => {
  try {
    return await fsPromises.rm(fileName, {
      recursive: true,
      force: true
    })
  } catch(err) {
    throw new HandledRespError() // inner try catch
  }
}

export const removeProjectData = async (projectID) => {
  const projectPath = getProjectDataPath(projectID)
  try {
    return await removeFile(projectPath)
  } catch(err) {
    throw err
  }
}

export const removeSceneData = async (sceneID) => {
  const scenePath = getSceneDataPath(sceneID)
  try {
    return await removeFile(scenePath)
  } catch(err) {
    throw err
  }
}