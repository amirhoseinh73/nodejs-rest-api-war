import mongoose, { Schema } from "mongoose"

const sceneSchema = new mongoose.Schema({
  title: {
    type: Schema.Types.String,
    required: true
  },
  target: {
    type: Schema.Types.String,
    required: false
  },
  target_size: {
    type: Schema.Types.Number, // size in KB
    required: false,
  },
  project_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Project"
  },
  created_at: {
    type: Schema.Types.Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Schema.Types.Date,
    required: true,
    default: Date.now
  },
  deleted_at: {
    type: Schema.Types.Date,
    required: false,
    default: null
  }
})

export default mongoose.model( "Scene", sceneSchema )