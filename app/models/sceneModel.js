import mongoose, { Schema } from "mongoose"

const sceneSchema = new mongoose.Schema({
  title: {
    type: Schema.Types.String,
    required: false
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
  images: {
    type: Schema.Types.Array,
    required: false
  },
  videos: {
    type: Schema.Types.Array,
    required: false
  },
  models: {
    type: Schema.Types.Array,
    required: false
  },
  upload_size: {
    type: Schema.Types.Number, // size in KB
    required: false
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