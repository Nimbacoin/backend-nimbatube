import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";

import User from "../../../db/schema/user.js";
import videoModal from "../../../db/schema/video.js";
const allChannels = express.Router();

allChannels.get("/", async (req, res) => {
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    await User.findOne({ _id: userId }).then(async (docadded) => {
      if (docadded) {
        let allNofy = [];
        const notification = docadded.notification;
        const videoHistory = notification.slice(0, 7);

        let videoId;
        await Promise.all(
          notification.map(async (item, index) => {
            videoId = item.from.videoId;
            await videoModal
              .findOne({ _id: videoId })
              .then(async (histyVid) => {
                let channelId;
                if (histyVid) {
                  channelId = histyVid.channelId;
                  await channelModal
                    .findOne({ _id: channelId })
                    .then(async (channel) => {
                      const data = {
                        index: index,
                        vid: item,
                        channelData: channel,
                        videoData: histyVid,
                      };
                      await allNofy.push(data);
                    });
                }
              });
          })
        );
        allNofy.sort((a, b) => (a.index < b.index ? 1 : -1));
        channelModal.find({ creator: userId }).then(async (channels) => {
          if (channels.length) {
            channels.map((item) => {});
            res.json({ responsData: { channels, notification: allNofy } });
          } else {
            res.json({
              responsData: { notification: allNofy },
              responsMessage: "NoChanelFounded",
            });
          }
        });
      } else if (!docadded) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
  }
});

export default allChannels;
