import { Messages } from "../helpers/messages.js"
import User from "../models/user.js"
import { respER } from "./response.js"

const getUser = async ( req, res, next ) => {
  let user

  try {
    user = await User.findById( req.params.id )
    if ( ! user ) return res.json( respER( 404, Messages.itemNotFound.replace( ":item", "user" ) ) )
  } catch( err ) {
    res.json( respER( 500, err ) )
  }

  res.user = user
  next()
}

export default getUser