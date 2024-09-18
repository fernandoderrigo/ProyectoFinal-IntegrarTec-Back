import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from './s3.js'

const MYMETYPES_AUDIO = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
    'audio/webm',
    'audio/mp4',
    'audio/x-m4a'
];

const uploadMp3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (_req, fileMp3, cb) {
            cb(null, { fieldName: fileMp3.fieldname })
        },
        key: function (_req, fileMp3, cb) {
            cb(null, Date.now().toString() + '--' + fileMp3.originalname)
        },
    }),
    fileFilter: function (_req, fileMp3, cb) {
        if (MYMETYPES_AUDIO.includes(fileMp3.mimetype)) {
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
}).single('audio_Url')

export default uploadMp3;