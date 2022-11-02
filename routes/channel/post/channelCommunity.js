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

channelCommunity.post("/", async (req, res) => {
  const { channelId, comment } = req.body;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(channelId)) {
    await channelModal
      .findOne({ _id: channelId })
      .then(async (channelAllComments) => {
        commentModal
          .create({
            creatore: userId,
            channelId,
            comment,
          })
          .then(async (com) => {
            if (com) {
              let allCom = channelAllComments.community;
              allCom.push({ id: com._id });
              const filter = { _id: channelId };
              const update = {
                comments: allCom,
              };
              try {
                await channelModal.updateOne(filter, update);
                channelModal.findOne(filter, async (error, resuel) => {
                  if (resuel) {
                    let deniedTimeIDs = resuel.community;
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
                                    index: index,
                                    commentData: commentData,
                                    creatoreData: channel?.channelData,
                                  };
                                  console.log(
                                    "channel creator: ",
                                    channel?.creator
                                  );
                                  data.commentData.creatore = null;
                                  // data.creatoreData.creator = null;
                                  await comments.push(data);
                                });
                            });
                      })
                    );
                    deniedTimeIDs = comments;
                    const newData = comments.sort((a, b) =>
                      a.index > b.index ? 1 : -1
                    );
                    res.json({ responseData: newData });
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

export default channelCommunity;
