import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from './s3.js'

//Tipos de archivos permitidos
const MYMETYPES = ['image/png','image/jpeg','image/jpg','image/svg']

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (_req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        //Nombre de la imagen guardada en aws
        key: function (_req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname) 
        },
    }),
    limits: { fileSize: 20000000 },
    //Filtro para tipos de archivos recibidos
    fileFilter: function (_req, file, cb) {
       if(MYMETYPES.includes(file.mimetype)){
        return cb(null, true)
       } else {
        return cb({
            stack: 'This file is not allowed'
        })
       }
    }
}).single('file')