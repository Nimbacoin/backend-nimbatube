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
import { getVideoDurationInSeconds } from "get-video-duration";
import channelModal from "../../../db/schema/channel.js";

submiteVideo.post("/", (req, res) => {
  const { title, descreption } = req.body;
  const videoId = req.body.video_id;
  const userId = req.userId;
  let dur;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    getVideoDurationInSeconds(
      process.env.MAIN_ORIGN + "/api/get/read/video/" + videoId
    ).then((duration) => {
      if (duration < 60) {
        var roundedString = duration.toFixed(0);
        dur = `0.${roundedString}`;
        console.log(dur);
      } else if (duration >= 60 && duration < 3600) {
        const minutes = duration / 60;
        var roundedString = minutes.toFixed(2);
        var rounded = Number(roundedString);
        dur = `${rounded}`;
      } else if (duration >= 3600) {
        const minutes = duration / 120;
        var roundedString = minutes.toFixed(2);
        var rounded = Number(roundedString);
        dur = `${rounded}`;
      }
      const filter = { _id: videoId };
      const update = {
        duration: dur,
      };
      videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
        if (resuel) {
        }
      });
    });

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
          console.log(id);
          try {
            User.findOne({ _id: id }).then(async (useData) => {
              // const updateUse = { notification: [] };
              // const filterUse = { _id: id };
              // await User.updateOne(filterUse, updateUse);
              const event = new Date();
              const userNotfy = useData.notification;
              const newUserNotfy = [
                ...userNotfy,
                {
                  id: "VIDEO-UPLAOD",
                  from: {
                    channel: channelId,
                    user: userId,
                    videoId: videoId,
                    createAt: `${event}`,
                  },
                },
              ];
              console.log(newUserNotfy);
              const updateUser = { notification: newUserNotfy };
              const filterUser = { _id: id };
              await User.updateOne(filterUser, updateUser);
            });
          } catch (error) {}
        });
      }
      //   await videoModal.updateOne(filter, update);

      if (resuel) {
        console.log("videos submited");
        res.json({ uploaded: true });
      }
    });
  }
});

export default submiteVideo;
