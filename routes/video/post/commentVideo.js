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
import channelModal from "../../../db/schema/channel.js";

submiteVideo.post("/", async (req, res) => {
  const { videoId, comment } = req.body;

  const userId = req.userId;
  console.log("comment");
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    await videoModal.findOne({ _id: videoId }).then(async (video) => {
      commentModal
        .create({
          creatore: userId,
          videoId,
          comment,
        })
        .then(async (com) => {
          if (com) {
            let allCom = video.comments;
            allCom.push({ id: com._id });
            const filter = { _id: videoId };
            const update = {
              comments: allCom,
            };
            try {
              await videoModal.updateOne(filter, update);
              videoModal.findOne(filter, async (error, resuel) => {
                if (resuel) {
                  let deniedTimeIDs = resuel.comments;
                  const comments = [];
                  await Promise.all(
                    deniedTimeIDs.map(async (com, index) => {
                      let comId = com.id;
                      if (mongoose.Types.ObjectId.isValid(comId))
                        await commentModal
                          .findOne({ _id: comId })
                          .then(async (commentData) => {
                            console.log(
                              "comment creatore: ",
                              commentData.creatore
                            );
                            await channelModal
                              .findOne({ creator: commentData.creatore })
                              .then(async (channel) => {
                                const data = {
                                  commentData: commentData,
                                  creatoreData: channel.channelData,
                                };
                                console.log(
                                  "channel creator: ",
                                  channel.creator
                                );
                                data.commentData.creatore = null;
                                // data.creatoreData.creator = null;
                                await comments.push(data);
                              });
                          });
                    })
                  );
                  deniedTimeIDs = comments;
                  res.json({ responseData: deniedTimeIDs });
                }
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
    });
  }
});

export default submiteVideo;
