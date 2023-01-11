import { HandledRespError } from "../helpers/errorThrow.js"
import { respER } from "./response.js"

const isAuth = async ( req, res, next ) => {
  const authorization = req.headers.authorization

  try {
    if ( ! authorization ) throw new HandledRespError(401, Messages.userUnauth)

    let token = authorization.split( "Bearer " )
    if ( token.length !== 2 ) throw new HandledRespError(401, Messages.userUnauth)
    token = token[1]

    if ( jwt_blacklist.includes(token) ) throw new HandledRespError(401, Messages.userUnauth)

    const userVerified = jwt.verify( token, JWT_SECRET )

    const userInfo = await User.findById(userVerified.id).lean()
    if ( ! userInfo ) throw new HandledRespError(401, Messages.userUnauth)

    userInfo.token = token
    res.userInfo = userInfo.userInfo
    next()
  } catch( err ) {
    return res.status(err.statusCode).json(respER(err.statusCode, err.message))
  }
}

export default isAuth