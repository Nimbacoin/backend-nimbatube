import express from "express";
const newUpload = express.Router();
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import channelModal from "../../../db/schema/channel.js";
import videoModal from "../../../db/schema/video.js";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import s3UploadVideo from "./upload/aws3.js";

const __dirname = path.resolve();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "./uploads"));
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
newUpload.post(
  "/post/video/create-new-thumbnail/:token",
  AuthToken,
  upload.single("thumbnail"),
  async (req, res) => {
    const File = req.file;
    const contentType = File.mimetype;
    const videoData = req.body.videoId;
    if (
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpg" ||
      contentType === "image/jpeg" ||
      contentType === "image/jfif" ||
      contentType === "image/svg"
    ) {
      if (mongoose.Types.ObjectId.isValid(videoData)) {
        videoModal.findOne({ _id: videoData }).then(async (videoDataId) => {
          if (videoDataId) {
            fs.readFile(File.path, async (err, buffer) => {
              const reslt = await s3UploadVideo(
                buffer,
                File.originalname,
                "video-thumbnail",
                process.env.AWS_BUCKET_NAME
              );
              const filter = { _id: videoData };
              if (reslt && reslt.Location) {
                try {
                  var update = videoDataId;
                  update.thumbnail = reslt.Location;
                  if (videoDataId) {
                    await videoModal.updateOne(filter, update);
                    const dataFile = await videoModal.findOne(filter);
                    res.json({ file: dataFile, uploaded: true });
                  }
                } catch (error) {}
              }
            });
          }
        });
      }
    } else {
      res.json({ uplaod: false, error: "NOT-IMAGE" });
    }
  }
);

export default newUpload;
