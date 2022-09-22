import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const videoData = express.Router();
import videoModal from "../../../db/schema/video.js";
import https from "http";
import axios from "axios";
import jwt from "jsonwebtoken";
import commentModal from "../../../db/schema/comment.js";
import * as cookie from "cookie";

const AuthToken = async (req, reqParamsToken) => {
  if (
    typeof reqParamsToken !== "undefined" &&
    reqParamsToken !== "undefined" &&
    reqParamsToken.length > 20
  ) {
    // const CookiesParsed = JSON.parse(reqParamsToken);
    const CookiesParsed = cookie.parse(reqParamsToken);
    
    const User = CookiesParsed.user;

    if (typeof User !== "undefined") {
      const userTokken = JSON.parse(User);
      const accesToken = userTokken.accessToken;

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      jwt.verify(accesToken, accessTokenSecret, function (err, decoded) {
        if (!err) {
          req.userId = decoded;
          return decoded;
        } else if (err) {
          console.log(err);
        }
      });
    } else {
      return null;
    }
  }
};

videoData.get("/get/video/:videoId/:unique_id/:userId", async (req, res) => {
  const userId = req.params.userId;
  await AuthToken(req, userId);
  const reqUserId = req.userId;

  const unique_id = req.params.unique_id;
  const videoId = req.params.videoId;

  if (mongoose.Types.ObjectId.isValid(videoId)) {
    videoModal.findOne({ _id: videoId }).then((video) => {
      if (video) {
        const views = video?.views;
        const filter = { _id: videoId };
        let update = { views: [...views, { id: unique_id }] };
        videoModal.findOneAndUpdate(filter, update, async (error, resuel) => {
          let likes = resuel.likes;
          let disLikes = resuel.disLikes;
          let isLiked = likes.some(({ id }) => id === reqUserId);
          let isDisLiked = disLikes.some(({ id }) => id === reqUserId);
          if (resuel) {
            let resuelData = JSON.stringify([resuel]);
            var videoData = JSON.parse(resuelData);
            let comId;

            await Promise.all(
              videoData.map(async (items) => {
                items.likes = { liked: isLiked, likes: likes.length };

                items.disLikes = {
                  isDisLiked: isDisLiked,
                  disLikes: disLikes.length,
                };
              })
            );
            const comments = [];
            await Promise.all(
              videoData[0].comments.map(async (com, index) => {
                let comId = com.id;
                if (mongoose.Types.ObjectId.isValid(comId))
                  await commentModal
                    .findOne({ _id: comId })
                    .then(async (commentData) => {
                      await channelModal
                        .findOne({ creator: commentData.creatore })
                        .then(async (channel) => {
                          const data = {
                            commentData: commentData,
                            creatoreData: channel.channelData,
                          };
                          data.commentData.creatore = null;
                          // data.creatoreData.creator = null;
                          await comments.push(data);
                        });
                    });
              })
            );
            //console.log(comments);
            videoData[0].comments = comments;
            channelModal
              .findById({ _id: resuel.channelId })
              .then(async (channel) => {
                let channelDataJSON = JSON.stringify([channel]);
                var channelData = JSON.parse(channelDataJSON);
                const inInFollowers = channel.followers.some(
                  ({ id }) => id === reqUserId
                );
                channelData.map((item) => {
                  item.followers = {
                    followers: channel.followers.length,
                    followed: inInFollowers,
                  };
                });
                // console.log(channelData[0].followers);

                res.json({
                  responseData: videoData[0],
                  channelData: channelData[0],
                  getting: unique_id,
                });
              });
          }
        });
      }
    });
  }
});

export default videoData;
