import { HandledRespError } from "../helpers/errorThrow.js"
import { Messages } from "../helpers/messages.js"
import User from "../models/userModel.js"
import { respER } from "../helpers/response.js"

const getSpecificUserByID = async ( req, res, next ) => {
  try {
    const userByID = await User.findById( req.params.id )
    if ( ! userByID ) throw new HandledRespError(404, Messages.itemNotFound.replace( ":item", "user" ))

    res.userByID = userByID
    next()
  } catch(err) {
    if ( ! err.statusCode ) err.statusCode = 500
    return res.status(err.statusCode).json(respER(err.statusCode, err.message))
  }
}

export default getSpecificUserByID