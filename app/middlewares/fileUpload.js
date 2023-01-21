import { v4 as uuidv4 } from "uuid"
import multer from "multer";
import { AVAILABLE_IMAGE_FORMATS, AVAILABLE_VIDEO_FORMATS, __dir_images__, __dir_videos__ } from "../config.js";
import { HandledRespError } from "../helpers/errorThrow.js";

// export const uploadImage = multer({ dest: __dir_images__ });
// export const uploadVideo = multer({ dest: __dir_videos__ });

const multerStorageFileName = function(req, file, cb) {
  const uniqueName = uuidv4() + "--" + file.originalname
  return cb(null, uniqueName)
}

const imageStorage = multer.diskStorage({
  destination: __dir_images__,
  filename: multerStorageFileName
});

const imageFileFilter = function(req, file, cb) {
  if ( ! AVAILABLE_IMAGE_FORMATS.includes(file.mimetype) ) return cb(new HandledRespError(406), false)

  cb(null, true)
}

export const imageUpload = multer({storage: imageStorage, fileFilter: imageFileFilter})

const videoStorage = multer.diskStorage({
  destination: __dir_videos__,
  filename: multerStorageFileName
});

const videoFileFilter = function(req, file, cb) {
  if ( ! AVAILABLE_VIDEO_FORMATS.includes(file.mimetype)) return cb(new HandledRespError(406), false)

  cb(null, true)
}

export const videoUpload = multer({storage: videoStorage, fileFilter: videoFileFilter})