import path from "path"
import { __dir_projects__, __scene_data_file_name_, __subdir_projects__ } from "../config.js"
import { promises as fsPromises } from "fs";
import fs from "fs";
import { HandledRespError } from "./errorThrow.js";

const createScenePaths = (userDIR, pathDIR) => {
  let flag = false

  // create user path by id
  if( ! fs.existsSync( userDIR ) ) fs.mkdir( userDIR, err => flag = err)

  fs.mkdir(pathDIR, err => flag = err)

  Object.values(__subdir_projects__).forEach( dir => {
    if (flag) return
    const subDIR = path.join( pathDIR, dir )

    fs.mkdir( subDIR, err => flag = err )
  } )

  if (flag) return false
  return true
}

export const getScenePath = (userID, pathName) => path.join(`${__dir_projects__}/${userID}/${pathName}`)
export const getSceneDataPath = (userID, projectID) => `${__dir_projects__}/${userID}/${projectID}/${__scene_data_file_name_}`

export const createUserScenePaths = (userID, pathName) => {
  const userDIR = path.join(`${__dir_projects__}/${userID}`)
  const sceneDIR = getScenePath(userID, pathName)

  return createScenePaths(userDIR, sceneDIR)
}

export const readJsonFileByPath = async (filepath) => {
  try {
    return await fsPromises.readFile(filepath);
  } catch {
    throw new HandledRespError() // inner try catch
  }
}

export const writeJsonFileByPath = async (filepath, sceneData) => {
  try {
    return await fsPromises.writeFile(filepath, JSON.stringify(sceneData));
  } catch {
    throw new HandledRespError() // inner try catch
  }
}

export const removeSceneDIR = async (pathName) => {
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