import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true
  },
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