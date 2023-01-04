import { Messages } from "../helpers/messages.js"
import { respER, respSC } from "../middlewares/response.js"
import User from "../models/userModel.js"

const userController = {
  list: async ( req, res ) => {
    try {
      const users = await User.find()
      res.json( respSC( users ) )
    } catch( err ) {
      res.json( respER( 500, err ) )
    }
  },

  findOne: async ( req, res ) => {
    try {
      const user = await res.user
      if ( ! user ) return res.json( respER( 404, Messages.itemNotFound.replace( ":item", "user" ) ) )
      res.json( respSC( user ) )
    } catch( err ) {
      res.json( respER( 404, err ) )
    }
  },

  create: async ( req, res ) => {
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      mobile: req.body.mobile,
      password: req.body.password,
    })
  
    try {
      const newUser = await user.save()
      res.json( respSC( newUser, 201, Messages.itemCreated.replace( ":item", "user" ) ) )
    } catch( err ) {
      res.json( respER( 400, err ) )
    }
  },

  update: async ( req, res ) => {
    if ( req.body.firstname ) res.user.firstname = req.body.firstname
    if ( req.body.lastname ) res.user.lastname = req.body.lastname
    if ( req.body.mobile ) res.user.mobile = req.body.mobile
    if ( req.body.password ) res.user.password = req.body.password
  
    try {
      const updatedUser = await res.user.save()
      res.json( respSC( updatedUser, 200, Messages.itemUpdated.replace( ":item", "user" ) ) )
    } catch( err ) {
      res.json( respER( 400, err ) )
    }
  },

  delete: async ( req, res ) => {
    try {
      const user = await res.user
      if ( ! user ) return res.json( respER( 404, Messages.itemNotFound.replace( ":item", "user" ) ) )
      await user.remove()
      return res.json( respSC( [], 200, Messages.itemDeleted.replace( ":item", "user" ) ) )
    } catch( err ) {
      return res.json( respER( 500, err ) )
    }
  }
}

export default userController