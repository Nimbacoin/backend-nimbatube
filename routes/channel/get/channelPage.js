import express from "express";
import channelModal from "../../../db/schema/channel.js";
import mongoose from "mongoose";
import User from "../../../db/schema/user.js";
import commentModal from "../../../db/schema/comment.js";
const channelPage = express.Router();
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
// import channelVideos from "./chanelVideos.js";

const AuthToken = async (req, reqParamsToken) => {
  if (
    typeof reqParamsToken !== "undefined" &&
    reqParamsToken !== "undefined" &&
    reqParamsToken.length > 20
  ) {
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
        }
      });
    } else {
      return null;
    }
  }
};
channelPage.get("/get/channel/:channelId/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("userId", userId);
  const reqUserId = req.userId;
  await AuthToken(req, userId);
  const channelId = req.params.channelId;

  if (channelId && mongoose.Types.ObjectId.isValid(channelId)) {
    await channelModal.findOne({ _id: channelId }).then(async (channel) => {
      if (channel) {
        const channelData = [channel];
        const comments = [];
        await Promise.all(
          channelData[0].community.map(async (com, index) => {
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
                        creatoreData: channel?.channelData,
                      };
                      data.commentData.creatore = null;
                      await comments.push(data);
                    });
                });
          })
        );
        channelData[0].community = comments;
        const inInFollowers = channel.followers.some(
          ({ id }) => id === reqUserId
        );
        // channelVideos(channelId);
        res.json({
          responsData: channelData[0],
          videoData: [],
        });
      } else if (!channel) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
    res.end();
  }
});

export default channelPage;
