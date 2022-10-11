import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";

import User from "../../../db/schema/user.js";
import videoModal from "../../../db/schema/video.js";
const allChannels = express.Router();

allChannels.get("/", async (req, res) => {
  const userId = req.userId;
  console.log("all channels sent");
  if (mongoose.Types.ObjectId.isValid(userId)) {
    await User.findOne({ _id: userId }).then((docadded) => {
      if (docadded) {
        let allNofy = [];
        let vidId;
        let channelId;
        channelModal.find({ creator: userId }).then(async (channels) => {
          const notification = docadded.notification;

          await Promise.all(
            notification.map(async (vid, index) => {
              channelId = vid.from.channel;
              vidId = vid.from.videoId;
              await channelModal
                .findOne({ _id: channelId })
                .then(async (channel) => {
                  await videoModal
                    .findOne({ _id: vidId })
                    .then(async (vidoeData) => {
                      const data = {
                        vid,
                        channelData: channel,
                        videoData: vidoeData,
                      };

                      await allNofy.push(data);
                    });
                });
            })
          );
          console.log(allNofy);
          if (channels.length) {
            channels.map((item) => {
              console.log("channels is here", "channels");
            });
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
    console.log("SD");
  }
});

export default allChannels;
