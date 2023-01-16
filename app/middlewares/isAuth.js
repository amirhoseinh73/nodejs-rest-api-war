import jwt from "jsonwebtoken"
import { JWT_SECRET, jwt_blacklist } from "../config.js"
import User from "../models/userModel.js"
import { HandledRespError } from "../helpers/errorThrow.js"
import { Messages } from "../helpers/messages.js"
import { respER } from "./response.js"

const isAuth = async ( req, res, next ) => {
  const authorization = req.headers.authorization

  try {
    if ( ! authorization ) throw new HandledRespError(401, Messages.userUnauth)

    let token = authorization.split( "Bearer " )
    if ( token.length !== 2 ) throw new HandledRespError(401, Messages.userUnauth)
    token = token[1]

    if ( jwt_blacklist.includes(token) ) throw new HandledRespError(401, Messages.userUnauth)

    let userVerified
    try {
      userVerified = jwt.verify( token, JWT_SECRET )
    } catch {
      throw new HandledRespError(401, Messages.userUnauth)
    }

    const userInfo = await User.findById(userVerified.id)
    if ( ! userInfo ) throw new HandledRespError(401, Messages.userUnauth)

    userInfo.token = token
    res.userInfo = userInfo
    next()
  } catch( err ) {
    return res.status(err.statusCode).json(respER(err.statusCode, err.message))
  }
}

export default isAuth