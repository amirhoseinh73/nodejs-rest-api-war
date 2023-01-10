import path from "path"
import { __dir_projects, __dir_scene_data_, __subdir_projects } from "../config.js"
import { promises as fsPromises } from "fs";
import fs from "fs";

export const createScenePaths = (userDIR, pathDIR) => {
  let flag = false

  // create user path by id
  if( ! fs.existsSync( userDIR ) ) fs.mkdir( userDIR, err => flag = err)

  fs.mkdir(pathDIR, err => flag = err)

  Object.values(__subdir_projects).forEach( dir => {
    if (flag) return
    const subDIR = path.join( pathDIR, dir )

    fs.mkdir( subDIR, err => flag = err )
  } )

  if (flag) return false
  return true
}

export const createUserScenePaths = (pathName, userID) => {
  const userDIR = path.join(`${__dir_projects}/${userID}`)
  const pathDIR = path.join(`${__dir_projects}/${userID}/${pathName}`)

  return createScenePaths(userDIR, pathDIR)
}

export const getScenDataPath = (userID, projectName) => `${__dir_projects}/${userID}/${projectName}/${__subdir_projects.projects}/${__dir_scene_data_}`

export const readJsonFileByPath = async (filepath) => {
  return await fsPromises.readFile(filepath);
}

export const writeJsonFileByPath = async (filepath, sceneData) => {
  return await fsPromises.writeFile(filepath, JSON.stringify(sceneData));
}