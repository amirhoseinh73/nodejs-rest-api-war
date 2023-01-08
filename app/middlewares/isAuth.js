import User from "../models/userModel.js"
import { respER } from "./response.js"

const isAuth = async ( req, res, next ) => {
  // let statusCode = 500
  // try {
  //   const username = req.body.username
    
  //   const user = await User.find({username: req.params.username})
  //   if ( ! user ) {
  //     statusCode = 404
  //     return res.json( respER( statusCode, Messages.itemNotFound.replace( ":item", "user" ) ) )
  //   }
  // } catch( err ) {
  //   return res.json( respER( statusCode, err ) )
  // }

  next()
}

export default isAuth