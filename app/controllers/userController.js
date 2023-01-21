import bcryptjs from "bcryptjs"
import { Messages } from "../helpers/messages.js"
import { respSC } from "../helpers/response.js"
import jwt from "jsonwebtoken"
import { jwt_blacklist, JWT_SECRET } from "../config.js"
import { HandledRespError, resErrCatch } from "../helpers/errorThrow.js"
import { User } from "../config.js"

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
        throw new HandledRespError(409)
      }
      
      return res.status(201).json(respSC(newUser, 201, Messages.itemCreated.replace(":item", "user")))
    } catch(err) {
      return resErrCatch(res, err)
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
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  logout: async function( req, res ) {
    try {
      const userInfo = await res.userInfo

      jwt_blacklist.push(userInfo.token)
      
      return res.status(200).json(respSC([]) )
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  info: async function( req, res ) {
    try {
      const userInfo = await res.userInfo

      return res.status(200).json(respSC(userInfo))
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  changePass: async function( req, res ) {
    try {
      const userInfo = res.userInfo
      const body = req.body

      if ( ! await bcryptjs.compare( body.old_password, userInfo.password ) ) throw new HandledRespError(406, Messages.passwordWrong)
      if (body.new_password.length < 6) throw new HandledRespError(406, Messages.passwordNotVerified)

      try {
        userInfo.password = await bcryptjs.hash( body.new_password, 10 )
        await userInfo.save()
      } catch(err) {
        throw new HandledRespError(400)
      }

      return res.status(200).json(respSC(userInfo, 200, Messages.passwordChanged))
    } catch(err) {
      return resErrCatch(res, err)
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
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  list: async function( req, res ) {
    try {
      const users = await User.find()
      return res.status(200).json(respSC(users))
    } catch(err) {
      return resErrCatch(res, err)
    }
  },

  delete: async function( req, res ) {
    try {
      const userByID = await res.userByID
      
      try {
        await userByID.remove()
      } catch {
        throw new HandledRespError(500)
      }
      
      return res.status(200).json(respSC([],200, Messages.itemDeleted.replace( ":item", "user")))
    } catch(err) {
      return resErrCatch(res, err)
    }
  },
}

export default userController