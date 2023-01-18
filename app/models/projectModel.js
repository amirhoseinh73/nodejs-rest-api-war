import mongoose, { Schema } from "mongoose"

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
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