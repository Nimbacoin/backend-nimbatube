import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const videoData = express.Router();
import videoModal from "../../../db/schema/video.js";
import https from "http";
import axios from "axios";
import jwt from "jsonwebtoken";
const AuthToken = async (req, reqParamsToken) => {
  if (
    typeof reqParamsToken !== "undefined" &&
    reqParamsToken !== "undefined" &&
    reqParamsToken.length > 20
  ) {
    const CookiesParsed = JSON.parse(reqParamsToken);

    const User = CookiesParsed;
    if (typeof User !== "undefined") {
      const accesToken = User.accessToken;
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
            var deniedTimeIDs = JSON.parse(resuelData);
            // console.log(deniedTimeIDs);
            deniedTimeIDs.map((items) => {
              items.likes = { liked: isLiked, likes: likes.length };
              items.disLikes = {
                isDisLiked: isDisLiked,
                disLikes: disLikes.length,
              };

              //  console.log(items);
            });
            // resuelData.likes = [{ liked: isLiked, likesNumber: likes.length }];
            // resuelData.disLikes = [
            //   { isDisLiked, disLikesNumber: disLikes.length },
            // ];
            channelModal.findById({ _id: resuel.channelId }).then((channel) => {
              res.json({
                responseData: deniedTimeIDs[0],
                channelData: channel,
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
