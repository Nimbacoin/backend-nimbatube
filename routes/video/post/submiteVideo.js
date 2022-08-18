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

submiteVideo.post("/", (req, res) => {
  const { title, descreption } = req.body;
  const videoId = req.body.video_id;

  if (videoId) {
    const filter = { _id: videoId };
    const update = { descreption: descreption, title: title };
    videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
      if (resuel) {
        res.json({ uploaded: true });
      }
    });
  }
});

export default submiteVideo;
