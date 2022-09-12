import express from "express";
import User from "../../../db/schema/user.js";
const likeVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/video.js";
import { getVideoDurationInSeconds } from "get-video-duration";

likeVideo.post("/", (req, res) => {
  let dataArrayLikes = [];
  let dataArrayDisLikes = [];
  const { userId, IsLiked, IsDisLiked, videoId } = req.body;
  if (!IsLiked && !IsDisLiked) {
    dataArray = [];
    dataArrayDisLikes = [];
    // remove likes and disLikes
  } else if (IsLiked && !IsDisLiked) {
    // lived
  } else if (!IsLiked && IsDisLiked) {
    // disliked
  }
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    const filter = { _id: videoId };
    const update = {
      descreption: descreption,
      title: title,
    };
    videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
      if (resuel) {
        res.json({ responseData: true });
      }
    });
  }
});

export default likeVideo;
