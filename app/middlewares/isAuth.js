import userController from "../controllers/userController.js"
import { respER } from "./response.js"

const isAuth = async ( req, res, next ) => {
  let statusCode = 500
  try {
    const userInfo = await userController.getInfo( req, res )

    if ( ! userInfo ) {
      statusCode = 401
      return res.status(statusCode).json( respER(statusCode, "User Unauthorized!") )
    }

    res.userInfo = userInfo.userInfo
    next()
  } catch( err ) {
    statusCode = 401
    return res.status(statusCode).json( respER(statusCode, "User Unauthorized!") )
  }
}

export default isAuth