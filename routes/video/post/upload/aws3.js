// import { S3 } from "aws-sdk";
import pkg from "aws-sdk";
const { S3 } = pkg;
import { v4 as uuidv4 } from "uuid";

const s3UploadVideo = async (file) => {
  const s3 = new S3();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `videos/${uuidv4() + file.originalname}`,
    Body: file.buffer,
  };
  return await s3.upload(params).promise();
};

export default s3UploadVideo;
