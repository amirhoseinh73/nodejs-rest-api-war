import { Messages } from "./messages.js";

export class HandledRespError {
  constructor(statusCode = 500, message = Messages.failed) {
    return {
      statusCode: statusCode,
      message: message
    }
  }
}