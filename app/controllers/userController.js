import bcryptjs from "bcryptjs"
import { Messages } from "../helpers/messages.js"
import { respER, respSC } from "../middlewares/response.js"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { jwt_blacklist, JWT_SECRET } from "../config.js"
import { HandledRespError } from "../helpers/errorThrow.js"

const userController = {
  register: async function( req, res ) {
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      mobile: req.body.mobile,
      password: req.body.password
    })
  
    try {
      if (user.password.length < 6) throw new HandledRespError(406, Messages.passwordNotVerified)

      let newUser
      try {
        user.password = await bcryptjs.hash( user.password, 10 )
        newUser = await user.save()
      } catch {
        throw new HandledRespError(400)
      }
      
      return res.status(201).json(respSC(newUser, 201, Messages.itemCreated.replace(":item", "user")))
    } catch( err ) {
      return res.status(err.statusCode).json(respER(err.statusCode, err.message))
    }
  },

  login: async function( req, res ) {
    const username = req.body.username
    const password = req.body.password

    try {
      const user = await User.findOne({username}).lean()
      if ( ! user ) throw new HandledRespError(404, Messages.itemNotFound.replace( ":item", "user" ))

      if ( ! await bcryptjs.compare( password, user.password ) ) throw new HandledRespError(404, Messages.itemNotFound.replace( ":item", "user" ))

      const token = jwt.sign({
        id: user._id,
        username: user.username
      }, JWT_SECRET, {expiresIn: "1d"})

      return res.status(200).json(respSC(token))
    } catch( err ) {
      return res.status(500).json(respER(statusCode, err))
    }
  },

  logout: async function( req, res ) {
    try {
      const userInfo = await res.userInfo

      jwt_blacklist.push(userInfo.token)
      
      return res.status(200).json(respSC([]) )
    } catch( err ) {
      return res.status(500).json(respER())
    }
  },

  list: async function( req, res ) {
    try {
      const users = await User.find()
      return res.status(200).json(respSC(users))
    } catch( err ) {
      return res.status(500).json(respER(500, err))
    }
  },

  info: async function( req, res ) {
    try {
      const userInfo = await res.userInfo

      return res.status(200).json(respSC(userInfo))
    } catch( err ) {
      return res.status(500).json(respER())
    }
  },

  changePass: async function( req, res ) {
    try {
      const userInfo = res.userInfo

      if (userInfo.password.length < 6) throw new HandledRespError(406, Messages.passwordNotVerified)

      try {
        userInfo.password = await bcryptjs.hash( user.password, 10 )
        await userInfo.save()
      } catch {
        throw new HandledRespError(400)
      }

      return res.status(200).json(respSC(userInfo, 200, Messages.passwordChanged))
    } catch(err) {
      return res.status(err.statusCode).json(respER(err.statusCode, err.message))
    }
  },

  update: async function( req, res ) {  
    try {
      const userInfo = await res.userInfo
      const body = req.body
      if ( body.firstname ) userInfo.firstname = body.firstname
      if ( body.lastname ) userInfo.lastname = body.lastname
      if ( body.mobile ) userInfo.mobile = body.mobile

      try {
        await userInfo.save()
      } catch {
        throw new HandledRespError()
      }

      return res.status(200).json(respSC(userInfo, 200, Messages.itemUpdated.replace( ":item", "user" )))
    } catch( err ) {
      return res.status(err.statusCode).json(respER(err.statusCode, err.message))
    }
  },

  delete: async function( req, res ) {
    try {
      const userInfo = await res.userInfo
      
      try {
        await userInfo.remove()
      } catch {
        throw new HandledRespError(500)
      }
      
      return res.status(200).json(respSC([],200, Messages.itemDeleted.replace( ":item", "user")))
    } catch( err ) {
      return res.status(err.statusCode).json(respER(err.statusCode, err.message))
    }
  },
}

export default userController