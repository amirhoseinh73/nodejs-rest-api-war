import { Messages } from "../helpers/messages.js";

export const respSC = ( data, code = 200, message = Messages.success ) => {
  return {
    status: "success",
    statusCode: code,
    message: message,
    data: data
  }
}

export const respER = ( code = 500, message = Messages.failed, data = [] ) => {
  return {
    status: "failed",
    statusCode: code,
    message: message,
    data: data
  }
}
