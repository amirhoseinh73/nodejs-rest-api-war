import { HandledRespError } from "../helpers/errorThrow.js"
import { respER } from "../helpers/response.js"

const isAdmin = async ( req, res, next ) => {
  try {
    const userInfo = await res.userInfo
    if ( ! userInfo.is_admin ) throw new HandledRespError(401)

    next()
  } catch(err) {
    if ( ! err.statusCode ) err.statusCode = 500
    return res.status(err.statusCode).json(respER(err.statusCode, err.message))
  }
}

export default isAdmin