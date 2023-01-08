import User from "../models/userModel.js"
import { respER } from "./response.js"

const isAdmin = async ( req, res, next ) => {
  // try {
  //   const user = await User.where()
  //   if ( ! user ) return res.json( respER( 404, Messages.itemNotFound.replace( ":item", "user" ) ) )
  // } catch( err ) {
  //   res.json( respER( 500, err ) )
  // }

  next()
}

export default isAdmin