import express from "express";
const newUpload = express.Router();
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import channelModal from "../../../../db/schema/channel.js";
import videoModal from "../../../../db/schema/video.js";
import AuthToken from "../../../../utils/verify-user/VerifyUser.js";
import s3UploadVideo from "../../../video/post/upload/aws3.js";
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
  "/post/channel/channel-cover-image/:token",
  AuthToken,
  upload.single("thumbnail"),
  async (req, res) => {
    const File = req.file;
    const contentType = File.mimetype;
    if (
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpg" ||
      contentType === "image/jpeg" ||
      contentType === "image/jfif" ||
      contentType === "image/svg"
    ) {
      const channelId = req.body.channelId;
      if (mongoose.Types.ObjectId.isValid(channelId)) {
        channelModal.findOne({ id: channelId }).then(async (channel) => {
          if (channel.creator === req.userId) {
            fs.readFile(File.path, async (err, buffer) => {
              const reslt = await s3UploadVideo(
                buffer,
                File.originalname,
                "channel-images-profile",
                process.env.AWS_BUCKET_NAME
              );
              const filter = { _id: channelId };
              if (reslt && reslt.Location) {
                try {
                  await channelModal.findOne(filter).then(async (doc) => {
                    var update = doc;
                    update.channelData.coverImg.url = reslt.Location;
                    if (doc) {
                      await channelModal.updateOne(filter, update);
                      const dataFile = await channelModal.findOne(filter);
                      res.json({ file: dataFile, uploaded: true });
                    }
                  });
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
