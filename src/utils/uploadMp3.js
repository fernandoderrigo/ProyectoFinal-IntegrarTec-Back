import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from './s3.js'

const MYMETYPES_AUDIO = [
    'audio/mpeg',        // MP3
    'audio/wav',         // WAV
    'audio/ogg',         // OGG
    'audio/aac',         // AAC
    'audio/flac',        // FLAC
    'audio/webm',        // WebM Audio
    'audio/mp4',         // MP4 (audio)
    'audio/x-m4a'        // M4A (MPEG-4 Audio)
  ];
  
const uploadMp3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (_req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: function (_req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        },
    }),
    fileFilter: function (_req, file, cb) {
        if(MYMETYPES_AUDIO.includes(file.mimetype)){
         return cb(null, true)
        } else {
         return cb({
             stack: 'This file is not allowed'
         })
        }
     },
    limits: {
        fileSize: 6000000
    }
}).single('track')

export default uploadMp3;