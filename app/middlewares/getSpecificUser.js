import { HandledRespError } from "../helpers/errorThrow.js"
import { Messages } from "../helpers/messages.js"
import User from "../models/userModel.js"
import { respER } from "./response.js"

const getSpecificUserByID = async ( req, res, next ) => {
  try {
    const userByID = await User.findById( req.params.id )
    if ( ! userByID ) throw new HandledRespError(404, Messages.itemNotFound.replace( ":item", "user" ))

    res.userByID = userByID
    next()
  } catch( err ) {
    return res.status( statusCode ).json( respER( statusCode, err ) )
  }
}

export default getSpecificUserByID