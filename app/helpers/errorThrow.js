import { Messages } from "./messages.js";
import { respER } from "./response.js";

export class HandledRespError {
  constructor(statusCode = 500, message = Messages.failed) {
    return {
      statusCode: statusCode,
      message: message
    }
  }
}

export function resErrCatch(res, err) {
  if ( ! err.statusCode ) err.statusCode = 500
  if ( ! err.message ) err.message = Messages.failed
  return res.status(err.statusCode).json( respER(err.statusCode, err.message) )
}