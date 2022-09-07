import express from "express";
import User from "../../../db/schema/user.js";
const createNewVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/video.js";

const mongoURL = process.env.MONGOCONNECT;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;
conn.once("open", () => {
  console.log("db is connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "video",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("video");
});

const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    const channelId = req.body.channelId;

    return new Promise((resolve, reject) => {
      console.log("here");
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log("here");
          return reject(err);
        } else {
          console.log("here");
          const filename =
            channelId + buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "video",
          };
          resolve(fileInfo);
        }
      });
    });
  },
});

const upload = multer({ storage });
createNewVideo.post(
  "/post/video/create-new-video/:token",
  AuthToken,
  upload.single("video"),
  async (req, res) => {
    const File = req.file;
    if (File && File.contentType !== "video/mp4") {
      gfs.files.deleteOne(
        { filename: File.filename, root: "video" },
        (err, gridStore) => {
          if (err) {
            console.log("i dont want to delete the file ok");
            return res.status(404).json({ err: err });
          } else {
            res.json({ message: "ONLYVIDEOS" });
          }
        }
      );
    } else {
      const channelId = req.body.channelId;
      const creatoreId = req.userId;
      await videoModal
        .create({
          channelId,
          creatore: creatoreId,
          filename: File.filename,
          fileId: File.id,
        })
        .then((newFile) => {
          console.log(newFile);
          res.json({ file: newFile, uploaded: true });
        });
    }
  }
);

export default createNewVideo;
