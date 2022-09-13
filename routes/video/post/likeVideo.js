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
  const { IsLiked, IsDisLiked, videoId } = req.body;
  const userId = req.userId;

  if (mongoose.Types.ObjectId.isValid(videoId)) {
    videoModal.findOne({ _id: videoId }).then((vid) => {
      if (vid) {
        
        const arrayDisLikes = vid.disLikes;
        const arrayLikes = vid.likes;
        if (IsLiked && !IsDisLiked) {
          arrayLikes.push({ id: videoId });
          arrayDisLikes.filter((user) => user.id !== userId);
          const update = { likes: arrayLikes, disLikes: arrayDisLikes };
          const filter = { _id: videoId };
          videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
            if (resuel) {
              console.log(resuel);
              res.json({ responseData: true });
            }
          });
        } else if (!IsLiked && IsDisLiked) {
          arrayDisLikes.push({ id: videoId });
          arrayLikes.filter((user) => user.id !== userId);
          const update = { likes: arrayLikes, disLikes: arrayDisLikes };
          const filter = { _id: videoId };
          videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
            if (resuel) {
              console.log(resuel);
              res.json({ responseData: true });
            }
          });
        }
      }
    });
  }
});

export default likeVideo;
