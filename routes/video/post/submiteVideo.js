import express from "express";
import User from "../../../db/schema/user.js";
const submiteVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";

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

submiteVideo.post("/", (req, res) => {
  const File = req.file;
  console.log("yes");
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
    console.log(File);
    res.json({ file: File, uploaded: true });
  }
});

export default submiteVideo;
