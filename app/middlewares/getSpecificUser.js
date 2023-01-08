import { Messages } from "../helpers/messages.js"
import User from "../models/userModel.js"
import { respER } from "./response.js"

const getSpecificUser = async ( req, res, next ) => {
  let user
  let statusCode = 200

  try {
    user = await User.findById( req.params.id )
    if ( ! user ) {
      statusCode = 404
      return res.status( statusCode ).json( respER( statusCode, Messages.itemNotFound.replace( ":item", "user" ) ) )
    }
  } catch( err ) {
    statusCode = 500
    res.status( statusCode ).json( respER( statusCode, err ) )
  }

  res.user = user
  next()
}

export default getSpecificUser