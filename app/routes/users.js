import { router } from "../config.js"
import User from "../models/user.js"


const getUser = async ( req, res, next ) => {
  let user

  try {
    user = await User.findById( req.params.id )
    if ( ! user ) return res.status( 404 ).json( {
      message: "user not found!"
    } )
  } catch( err ) {
    if ( err instanceof Error ) {
      res.status( 500 ).json( {
        message: err.message
      } )
    } else {
      res.status( 500 ).json( err )
    }
  }

  res.user = user
  next()
}


// get all users
router.get("/", async ( req, res ) => {
  try {
    const users = await User.find()
    res.json( users )
  } catch( err ) {
    if ( err instanceof Error ) {
      res.status( 500 ).json( {
        message: err.message
      } )
    } else {
      res.status( 500 ).json( err )
    }
  }
})

// get user
router.get("/:id", getUser, ( req, res ) => {
  res.send( res.user.firstname )
  res.json( res.user )
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
    res.status( 201 ).json( newUser )
  } catch( err ) {
    if ( err instanceof Error ) {
      res.status( 400 ).json( {
        message: err.message
      } )
    } else {
      res.status( 400 ).json( err )
    }
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
    res.json( updatedUser )
  } catch( err ) {
    if ( err instanceof Error ) {
      res.status( 400 ).json( {
        message: err.message
      } )
    } else {
      res.status( 400 ).json( err )
    }
  }
})

// delete user
router.delete("/:id", getUser, async ( req, res ) => {
  try {
    await res.user.remove()
    res.json( {
      message: "user deleted!"
    } )
  } catch( err ) {
    if ( err instanceof Error ) {
      res.status( 500 ).json( {
        message: err.message
      } )
    } else {
      res.status( 500 ).json( err )
    }
  }
})

export default router