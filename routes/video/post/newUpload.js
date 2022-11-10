import express from "express";
import User from "../../../db/schema/user.js";
const newUpload = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/video.js";
import { dirname } from "path";
import fs from "fs";
import s3UploadVideo from "./upload/aws3.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import timeHandelr from "./timeHandelr.js";
import channelModal from "../../../db/schema/channel.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
newUpload.post(
  "/post/video/create-new-video/:token",
  AuthToken,
  upload.single("video"),
  async (req, res) => {
    const channelId = req.body.channelId;
    if (mongoose.Types.ObjectId.isValid(channelId)) {
      channelModal.findOne({ id: channelId }).then(async (channel) => {
        if (channel.creator === req.userId) {
          const File = req.file;
          const reslt = await s3UploadVideo(File);
          console.log(reslt);
          if (reslt && reslt.Location) {
            const creatoreId = req.userId;
            await videoModal
              .create({
                channelId,
                location: reslt.Location,
                creatore: creatoreId,
                filename: File.filename,
                fileId: File.id,
              })
              .then(async (newFile) => {
                //console.log(newFile._id);
                const update = channel;
                try {
                  const filter = {
                    _id: channel._id,
                  };

                  update.channelData.numbers.uploads =
                    update.channelData.numbers.uploads + 1;
                  console.log(update.channelData);
                  await channelModal.updateOne(filter, update);
                } catch (error) {}
                timeHandelr(newFile._id);
                res.json({ file: newFile, uploaded: true });
              });
          }
        }
      });
    }
  }
);

export default newUpload;
