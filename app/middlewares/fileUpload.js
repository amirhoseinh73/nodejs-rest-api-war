import { v4 as uuidv4 } from "uuid"
import multer from "multer";
import { __dir_images__ } from "../config.js";


// export const uploadImage = multer({ dest: __dir_images__ });
// export const uploadVideo = multer({ dest: __dir_videos__ });

const multerStorageFileName = function(req, file, cb) {
  const uniqueName = uuidv4() + "-" + file.originalname
  return cb(null, uniqueName)
}

const storageImage = multer.diskStorage({
  destination: __dir_images__,
  filename: multerStorageFileName
});

export const uploadImage = multer({storage: storageImage})