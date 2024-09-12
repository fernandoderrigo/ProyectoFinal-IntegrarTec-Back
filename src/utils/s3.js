import aws from "aws-sdk";
import dotenv from 'dotenv'

dotenv.config()

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
})

const deleteFile = (key) => {
  return s3.deleteObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  }).promise()
}

const uploadFile = (file) => {
  return s3.upload({
    Bucket: process.env.BUCKET_NAME,
    Body: file.buffer,
    Key: Date.now().toString() + '-' + file.originalname,
  }).promise()
}

const getFile = (key) => {
  return s3.getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  }).promise()
}

export {deleteFile,uploadFile, getFile, s3 }