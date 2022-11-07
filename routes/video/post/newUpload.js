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

const storage = multer.memoryStorage();
const upload = multer({ storage });
newUpload.post(
  "/post/video/create-new-video/:token",
  AuthToken,
  upload.single("video"),
  async (req, res) => {
    const File = req.file;
    const reslt = await s3UploadVideo(File);
    console.log(reslt);
    if (reslt && reslt.Location) {
      const channelId = req.body.channelId;
      const creatoreId = req.userId;
      await videoModal
        .create({
          channelId,
          location: reslt.Location,
          creatore: creatoreId,
          filename: File.filename,
          fileId: File.id,
        })
        .then((newFile) => {
          res.json({ file: newFile, uploaded: true });
        });
    }

    // if (File && File.contentType !== "video/mp4") {
    //   gfs.files.deleteOne(
    //     { filename: File.filename, root: "video" },
    //     (err, gridStore) => {
    //       if (err) {
    //         // console.log("i dont want to delete the file ok");
    //         return res.status(404).json({ err: err });
    //       } else {
    //         res.json({ message: "ONLYVIDEOS" });
    //       }
    //     }
    //   );
    // } else {
    //   const channelId = req.body.channelId;
    //   const creatoreId = req.userId;
    //   await videoModal
    //     .create({
    //       channelId,
    //       creatore: creatoreId,
    //       filename: File.filename,
    //       fileId: File.id,
    //     })
    //     .then((newFile) => {
    //       res.json({ file: newFile, uploaded: true });
    //     });
    // }
  }
);

export default newUpload;
