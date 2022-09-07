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
import { getVideoDurationInSeconds } from "get-video-duration";

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
  let dur;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    getVideoDurationInSeconds(
      process.env.MAIN_ORIGN + "/api/get/read/video/" + videoId
    ).then((duration) => {
      if (duration < 60) {
        var roundedString = duration.toFixed(0);
        dur = `0.${roundedString}`;
        console.log(dur);
      } else if (duration >= 60 && duration < 3600) {
        const minutes = duration / 60;
        var roundedString = minutes.toFixed(2);
        var rounded = Number(roundedString);
        dur = `${rounded}`;
      } else if (duration >= 3600) {
        const minutes = duration / 120;
        var roundedString = minutes.toFixed(2);
        var rounded = Number(roundedString);
        dur = `${rounded}`;
      }
      const filter = { _id: videoId };
      const update = {
        duration: dur,
      };
      videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
        if (resuel) {
        }
      });
    });
    const filter = { _id: videoId };
    const update = {
      descreption: descreption,
      title: title,
    };
    videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
      if (resuel) {
        res.json({ uploaded: true });
      }
    });
  }
});

export default submiteVideo;
