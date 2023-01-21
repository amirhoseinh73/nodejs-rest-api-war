import { HandledRespError, resErrCatch } from "../helpers/errorThrow.js"
import { Messages } from "../helpers/messages.js"
import { User } from "../config.js"

const getSpecificUserByID = async ( req, res, next ) => {
  try {
    const userByID = await User.findById( req.params.id )
    if ( ! userByID ) throw new HandledRespError(404, Messages.itemNotFound.replace( ":item", "user" ))

    res.userByID = userByID
    next()
  } catch(err) {
    return resErrCatch(res, err)
  }
}

export default getSpecificUserByID