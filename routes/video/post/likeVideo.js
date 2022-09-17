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
        let arrayDisLikes = vid.disLikes;
        let arrayLikes = vid.likes;
        let isLiked = arrayLikes.some(({ id }) => id === userId);
        let isDisLiked = arrayDisLikes.some(({ id }) => id === userId);
        //
        console.log("body data:", { IsLiked, IsDisLiked });
        console.log("db data:", { isLiked: isLiked, isDisLiked: isDisLiked });
        if (IsLiked && !IsDisLiked) {
          if (isDisLiked) {
            arrayDisLikes = arrayDisLikes.filter(({ id }) => id !== userId);
          }
          if (!isLiked) {
            arrayLikes.push({ id: userId });
          }
          const update = { likes: arrayLikes, disLikes: arrayDisLikes };
          const filter = { _id: videoId };
          videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
            if (resuel) {
              isLiked = resuel.likes.some(({ id }) => id === userId);
              console.log("likes:", isLiked);
              res.json({
                responseData: {
                  likes: { liked: isLiked, likes: resuel.likes.length },
                  disLikes: {
                    isDisLiked: isDisLiked,
                    disLikes: resuel.disLikes.length,
                  },
                },
              });
            }
          });
        } else if (!IsLiked && IsDisLiked) {
          if (isLiked) {
            arrayLikes = arrayLikes.filter(({ id }) => id !== userId);
          }
          //console.log(arrayLikes);
          if (!isDisLiked) {
            arrayDisLikes.push({ id: userId });
          }
          const update = { likes: arrayLikes, disLikes: arrayDisLikes };
          const filter = { _id: videoId };
          videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
            if (resuel) {
              res.json({
                responseData: {
                  likes: { liked: isLiked, likes: resuel.likes.length },
                  disLikes: {
                    isDisLiked: isDisLiked,
                    disLikes: resuel.disLikes.length,
                  },
                },
              });
            }
          });
        } else if (!IsLiked && !IsDisLiked) {
          console.log("nothing ");

          arrayLikes.filter(({ id }) => id !== userId);
          arrayDisLikes.filter((user) => user.id !== userId);
          const update = { likes: arrayLikes, disLikes: arrayDisLikes };
          const filter = { _id: videoId };
          videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
            if (resuel) {
              console.log(arrayLikes);
              console.log(isLiked);

              res.json({
                responseData: {
                  likes: { liked: isLiked, likes: resuel.likes.length },
                  disLikes: {
                    isDisLiked: isDisLiked,
                    disLikes: resuel.disLikes.length,
                  },
                },
              });
            }
          });
        }
      }
    });
  }
  //res.json({ da: "SD" });
});

export default likeVideo;
