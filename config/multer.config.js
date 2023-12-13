import multer from "multer";
import path from 'path';
import fs from 'fs';

const publicDirectory = 'public/';
const uploadDirectory = 'uploads/';

// Create the 'public' and 'uploads' directories if they don't exist
if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory);
}

if (!fs.existsSync(path.join(publicDirectory, uploadDirectory))) {
  fs.mkdirSync(path.join(publicDirectory, uploadDirectory));
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(publicDirectory, uploadDirectory));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;
