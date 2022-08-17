import express from "express";
import User from "../../../db/schema/user.js";
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
    bucketName: "thumbnail",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("thumbnail");
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
            bucketName: "thumbnail",
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
  (req, res) => {
    const File = req.file;
    const contentType = File.contentType;
    console.log(contentType);
    if (
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpeg" ||
      contentType === "image/jfif" ||
      contentType === "image/svg"
    ) {
      console.log(File);
      res.json({ file: File, uploaded: true });
    } else {
      gfs.files.deleteOne(
        { filename: File.filename, root: "thumbnail" },
        (err, gridStore) => {
          if (err) {
            console.log("i dont want to delete the file ok");
            return res.status(404).json({ err: err });
          } else {
            res.json({ file: "ONLYIMAGEALLOWED" });
          }
        }
      );
    }
  }
);

export default createNewThumbnail;
