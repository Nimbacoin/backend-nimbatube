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
import channelModal from "../../../db/schema/channel.js";

submiteVideo.post("/", (req, res) => {
  const { title, descreption } = req.body;
  const videoId = req.body.video_id;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    const filter = { _id: videoId };
    const update = {
      descreption: descreption,
      title: title,
    };

    videoModal.findOneAndUpdate(filter, update, async (error, resuel) => {
      const channelId = resuel.channelId;
      if (channelId) {
        const channelId = resuel.channelId;
        const channelData = await channelModal.findOne({ _id: channelId });
        const followers = channelData.followers;
        followers.map(({ id }) => {
          try {
            User.findOne({ _id: id }).then(async (useData) => {
              // const updateUse = { notification: [] };
              // const filterUse = { _id: id };
              // await User.updateOne(filterUse, updateUse);
              const event = new Date();
              let userNotfy = useData?.notification;

              const newUserNotfy = [
                ...userNotfy,
                {
                  id: "VIDEO-UPLAOD",
                  seen: false,
                  name: event + "VIDEO-UPLAOD",
                  from: {
                    channel: channelId,
                    user: userId,
                    videoId: videoId,
                    createAt: `${event}`,
                  },
                },
              ];
              const updateUser = { notification: newUserNotfy };
              const filterUser = { _id: id };
              await User.updateOne(filterUser, updateUser);
            });
          } catch (error) {}
        });
      }
      //   await videoModal.updateOne(filter, update);

      if (resuel) {
        res.json({ uploaded: true });
      }
    });
  }
});

export default submiteVideo;
