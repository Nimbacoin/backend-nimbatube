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
import commentModal from "../../../db/schema/comment.js";

submiteVideo.post("/", async (req, res) => {
  const { videoId, comment } = req.body;

  const userId = req.userId;
  console.log(userId);
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    await videoModal.findOne({ _id: videoId }).then(async (video) => {
      commentModal
        .create({
          creatore: userId,
          videoId,
          comment,
        })
        .then((com) => {
          if (com) {
            //console.log(com);
            let allCom = video.comments;
            allCom.push({ id: com._id });
            // console.log(allCom);
            const filter = { _id: videoId };
            const update = {
              comments: allCom,
            };
            videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
              if (resuel) {
                // console.log(resuel.comments);
                res.json({ responseData: resuel.comments });
              }
            });
          }
        });
    });
  }
});

export default submiteVideo;
