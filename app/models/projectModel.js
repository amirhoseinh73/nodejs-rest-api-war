import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: true
  },
  // scale: {
  //   type: String,
  //   required: false
  // },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    required: false,
    default: null
  }
})

export default mongoose.model( "Project", projectSchema )