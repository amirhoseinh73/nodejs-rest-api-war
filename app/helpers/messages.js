import { APP_PORT } from "../config.js";

export const Messages = {
  connectedDB: "Database Connected.",
  serverRuning: `server started ${APP_PORT}...`,

  success: "Operation Complete!",
  failed: "Operation Failed!",

  noData: "not found any data.",

  userUnauth: "User Unauthorized!",

  itemNotFound: ":item not found.",
  itemCreated: ":item created successfully.",
  itemDeleted: ":item deleted successfully.",
  itemUpdated: ":item updated successfully.",

  passwordNotVerified: "Password should be at least 6 characters.",
  passwordChanged: "Password change successfully.",
  passwordWrong: "Old password not correct!",

  pathDuplicate: "Project Name already exists, please choose another name.",
  pathCreateFailed: "Sorry! project paths can not be created. please try again later.",
}