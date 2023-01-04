import { router } from "../config.js"
import { Messages } from "../helpers/messages.js"
import getUser from "../middlewares/getUser.js"
import { respER, respSC } from "../middlewares/response.js"
import User from "../models/user.js"

// get all users
router.get("/", async ( req, res ) => {
  try {
    const users = await User.find()
    res.json( respSC( users ) )
  } catch( err ) {
    res.json( respER( 500, err ) )
  }
})

// get user
router.get("/:id", getUser, async ( req, res ) => {
  try {
    const user = await res.user
    res.json( respSC( user ) )
  } catch( err ) {
    res.json( respER( 404, err ) )
  }
})

// create user
router.post("/", async ( req, res ) => {
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
})

// update user
// patch only update passed information to request
// put update all information of user instead of the information passed
router.patch("/", getUser, async ( req, res ) => {
  if ( req.body.firstname ) res.user.firstname = req.body.firstname
  if ( req.body.lastname ) res.user.lastname = req.body.lastname

  try {
    const updatedUser = await res.user.save()
    res.json( respSC( updatedUser, 200, Messages.itemUpdated.replace( ":item", "user" ) ) )
  } catch( err ) {
    res.json( respER( 400, err ) )
  }
})

// delete user
router.delete("/:id", getUser, async ( req, res ) => {
  try {
    await res.user.remove()
    res.json( respSC( [], 200, Messages.itemDeleted.replace( ":item", "user" ) ) )
  } catch( err ) {
    res.json( respER( 500, err ) )
  }
})

export default router