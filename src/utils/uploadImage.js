import multer from "multer";
import multerS3 from "multer-s3";
import {s3}  from './s3.js'

const MYMETYPES = ['image/png','image/jpeg','image/jpg','image/svg']

const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (_req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: function (_req, file, cb) {
            const folderName = 'images/';
            const fileName = Date.now().toString() + '-' + file.originalname;
            cb(null,folderName + fileName); 
        },
    }),
    limits: { fileSize: 20000000 },
    fileFilter: function (_req, file, cb) {
       if(MYMETYPES.includes(file.mimetype)){
        return cb(null, true)
       } else {
        return cb({
            stack: 'This file is not allowed'
        })
       }
    }
}).single('image_Url')

export default uploadImage;