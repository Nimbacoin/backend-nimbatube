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
    console.log("thum : is creating");
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        } else {
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
    console.log("thum : is created");
    const File = req.file;
    const contentType = File.contentType;
    if (
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpg" ||
      contentType === "image/jpeg" ||
      contentType === "image/jfif" ||
      contentType === "image/svg"
    ) {
      const videoId = req.body.videoId;

      if (videoId) {
        const filter = { _id: videoId };
        const update = { thumbnail: File.filename };
        videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
          if (resuel) {
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
