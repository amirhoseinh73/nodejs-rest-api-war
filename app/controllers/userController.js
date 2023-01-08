import bcryptjs from "bcryptjs"
import { Messages } from "../helpers/messages.js"
import { respER, respSC } from "../middlewares/response.js"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config.js"

const userController = {
  list: async function( req, res ) {
    let statusCode = 200
    try {
      const users = await User.find()
      return res.status( statusCode ).json( respSC( users, statusCode ) )
    } catch( err ) {
      statusCode = 500
      return res.status( statusCode ).json( respER( statusCode, err ) )
    }
  },

  findOne: async function( req, res ) {
    let statusCode = 200
    try {
      const user = await res.user

      if ( ! user ) {
        statusCode = 404
        return res.status( statusCode ).json( respER( statusCode, Messages.itemNotFound.replace( ":item", "user" ) ) )
      }
      return res.status( statusCode ).json( respSC( user ) )
    } catch( err ) {
      statusCode = 404
      return res.status( statusCode ).json( respER( statusCode, err ) )
    }
  },

  create: async function( req, res ) {
    let statusCode = 201
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      mobile: req.body.mobile,
      password: req.body.password
    })

    if ( user.password.length < 6 ) {
      statusCode = 406
      return res.status( statusCode ).json( respER( statusCode, Messages.passwordNotVerified ) )
    }
    user.password = await bcryptjs.hash( user.password, 10 )
  
    try {
      const newUser = await user.save()
      statusCode = 201
      return res.status( statusCode ).json( respSC( newUser, statusCode, Messages.itemCreated.replace( ":item", "user" ) ) )
    } catch( err ) {
      statusCode = 400
      return res.status( statusCode ).json( respER( statusCode, err ) )
    }
  },

  update: async function( req, res ) {
    let statusCode = 200
    if ( req.body.firstname ) res.user.firstname = req.body.firstname
    if ( req.body.lastname ) res.user.lastname = req.body.lastname
    if ( req.body.mobile ) res.user.mobile = req.body.mobile
    if ( req.body.password ) res.user.password = req.body.password
  
    try {
      const updatedUser = await res.user.save()
      return res.status( statusCode ).json( respSC( updatedUser, statusCode, Messages.itemUpdated.replace( ":item", "user" ) ) )
    } catch( err ) {
      statusCode = 400
      return res.status( statusCode ).json( respER( statusCode, err ) )
    }
  },

  delete: async function( req, res ) {
    let statusCode = 200
    try {
      const user = await res.user
      if ( ! user ) {
        statusCode = 404
        return res.status( statusCode ).json( respER( statusCode, Messages.itemNotFound.replace( ":item", "user" ) ) )
      }
      await user.remove()
      return res.status( statusCode ).json( respSC( [], statusCode, Messages.itemDeleted.replace( ":item", "user" ) ) )
    } catch( err ) {
      statusCode = 500
      return res.status( statusCode ).json( respER( statusCode, err ) )
    }
  },

  login: async function( req, res ) {
    let statusCode = 200

    const username = req.body.username
    const password = req.body.password

    try {
      const user = await User.findOne( {username} ).lean()
      if ( ! user ) {
        statusCode = 404
        return res.status( statusCode ).json( respER( statusCode, Messages.itemNotFound.replace( ":item", "user" ) ) )
      }

      if ( ! await bcryptjs.compare( password, user.password ) ) {
        statusCode = 404
        return res.status( statusCode ).json( respER( statusCode, Messages.itemNotFound.replace( ":item", "user" ) ) )
      }

      const token = jwt.sign({
        id: user._id,
        username: user.username
      }, JWT_SECRET)

      return res.status( statusCode ).json( respSC( token ) )
    } catch( err ) {
      statusCode = 500
      return res.status( statusCode ).json( respER( statusCode, err ) )
    }
  }
}

export default userController