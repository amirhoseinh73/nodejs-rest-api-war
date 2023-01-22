import { v4 as uuidv4 } from "uuid"
import multer from "multer";
import { AVAILABLE_IMAGE_FORMATS, AVAILABLE_VIDEO_FORMATS, AVAILABLE_ZIP_FORMATS, __dir_images__, __dir_tmp__, __dir_videos__, __dir_zips__ } from "../config.js";
import { Messages } from "../helpers/messages.js";

// export const uploadImage = multer({ dest: __dir_images__ });

const multerStorageFileName = function(req, file, cb) {
  const uniqueName = uuidv4() + "--" + file.originalname
  return cb(null, uniqueName)
}

const storage = multer.diskStorage({
  destination: __dir_tmp__,
  filename: multerStorageFileName
});

const fileFilter = (AVAILABLE_FORMATS, file, cb) => {
  const exeption = new Error(Messages.failed)
  exeption.statusCode = 406
  if ( ! AVAILABLE_FORMATS.includes(file.mimetype) ) return cb(exeption, false)

  cb(null, true)
}

const imageFileFilter = function(req, file, cb) {
  return fileFilter(AVAILABLE_IMAGE_FORMATS, file, cb)
}

const videoFileFilter = function(req, file, cb) {
  return fileFilter(AVAILABLE_VIDEO_FORMATS, file, cb)
}

const zipFileFilter = function(req, file, cb) {
  return fileFilter(AVAILABLE_ZIP_FORMATS, file, cb)
}

export const imageUpload = multer({storage: storage, fileFilter: imageFileFilter})
export const videoUpload = multer({storage: storage, fileFilter: videoFileFilter})
export const zipUpload = multer({storage: storage, fileFilter: zipFileFilter})