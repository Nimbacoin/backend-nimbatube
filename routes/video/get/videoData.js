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
      //console.log(accessTokenSecret, accesToken);
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
  console.log("herer", req.path);
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
          const likes = resuel.likes;
          const disLikes = resuel.disLikes;
          if (resuel) {
            channelModal.findById({ _id: resuel.channelId }).then((channel) => {
              res.json({
                responseData: resuel,
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
