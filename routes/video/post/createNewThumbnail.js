import express from "express";
import User from "../../../db/schema/user.js";
import videoModal from "../../../db/schema/video.js";
const createNewThumbnail = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";

const mongoURL = process.env.MONGOCONNECT;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket, gridfsBucketThumbnail;
conn.once("open", () => {
  console.log("db is connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    const channelId = req.body.channelId;

    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        } else {
          console.log("here");
          const filename =
            channelId + buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "images",
          };
          resolve(fileInfo);
        }
      });
    });
  },
});

const upload = multer({ storage });
createNewThumbnail.post(
  "/post/video/create-new-thumbnail/:token",
  AuthToken,
  upload.single("thumbnail"),
  async (req, res) => {
    const File = req.file;
    const contentType = File.contentType;
    console.log(contentType);
    if (
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpg" ||
      contentType === "image/jpeg" ||
      contentType === "image/jfif" ||
      contentType === "image/svg"
    ) {
      const videoId = req.body.videoId;
      console.log(videoId);
      if (videoId) {
        const filter = { _id: videoId };
        const update = { thumbnail: File.filename };
        videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
          if (resuel) {
            console.log(resuel);
            res.json({ file: File, uploaded: true });
          }
        });
      }
    } else {
      // gfs.files.deleteOne(
      //   { filename: File.filename, root: "images" },
      //   (err, gridStore) => {
      //     if (err) {
      //       console.log("i dont want to delete the file ok");
      //       return res.status(404).json({ err: err });
      //     } else {
      //       res.json({ file: "ONLYIMAGEALLOWED" });
      //     }
      //   }
      // );
    }
    req.file = null;
  }
);

export default createNewThumbnail;
