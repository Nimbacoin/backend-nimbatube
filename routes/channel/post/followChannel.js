import express from "express";
import User from "../../../db/schema/user.js";
const followChannel = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/video.js";
import channelModal from "../../../db/schema/channel.js";

followChannel.post("/", async (req, res) => {
  const channelId = req.body.channelId;
  const isFollowing = req.body.isFollowing;
  const userId = req.userId;

  if (mongoose.Types.ObjectId.isValid(channelId)) {
    await channelModal.findOne({ _id: channelId }).then(async (channel) => {
      if (channel) {
        const channelFollowers = channel.followers;
        const inInFollowers = channelFollowers.some(({ id }) => id === userId);
        if (!inInFollowers && isFollowing) {
          channelFollowers.push({ id: userId });
          console.log(channelFollowers);
          const update = { followers: channelFollowers };
          const filter = { _id: channelId };
          try {
            await channelModal.updateOne(filter, update);
            await channelModal.findOne(filter).then((resuelt) => {
              if (resuelt) {
                const followers = resuelt.followers.length;
                console.log("followed", followers);
                res.json({
                  responseData: {
                    followers: followers,
                    followed: true,
                  },
                });
              }
            });
          } catch (error) {
            console.log(error);
            res.end({ error: error.message });
          }
        } else if (inInFollowers && channelFollowers.length >= 1) {
          const index = channelFollowers.findIndex(({ id }) => id === userId);
          let dataNew = channelFollowers;
          dataNew = channelFollowers.splice(1, index);
          console.log(dataNew);
          const update = { followers: dataNew };
          const filter = { _id: channelId };
          try {
            await channelModal.updateOne(filter, update);
            await channelModal.findOne(filter).then((resuelt) => {
              if (resuelt) {
                const followers = resuelt.followers.length;
                console.log("not followed", followers);
                res.json({
                  responseData: {
                    followers: followers,
                    followed: false,
                  },
                });
              }
            });
          } catch (error) {
            console.log(error);
            res.end({ error: error.message });
          }
        } else {
          res.end({ error: "error.message" });
        }
      }
    });
  }
});

export default followChannel;
