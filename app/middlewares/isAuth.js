import User from "../models/userModel.js"
import { respER } from "./response.js"

const isAuth = async ( req, res, next ) => {
  // try {
  //   const username = req.body.username
  //   const password = req.body.password
  //   const user = await User.find({username: req.params.username})
  //   if ( ! user ) return res.json( respER( 404, Messages.itemNotFound.replace( ":item", "user" ) ) )
  // } catch( err ) {
  //   res.json( respER( 500, err ) )
  // }

  next()
}

export default isAuth