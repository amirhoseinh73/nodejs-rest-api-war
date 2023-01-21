import { HandledRespError } from "../helpers/errorThrow.js"

const isAdmin = async ( req, res, next ) => {
  try {
    const userInfo = await res.userInfo
    if ( ! userInfo.is_admin ) throw new HandledRespError(401)

    next()
  } catch(err) {
    return resErrCatch(res, err)
  }
}

export default isAdmin