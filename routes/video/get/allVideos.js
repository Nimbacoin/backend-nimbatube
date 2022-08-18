import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";

allVideos.get("/", async (req, res) => {
  console.log("here");
  videoModal.find({}).then((allVideos) => {
    console.log(allVideos);
    if (allVideos) {
      new Promise((resolve, reject) => {
        allVideos.map(async (vid) => {
          await channelModal
            .findOne({ _id: vid.chanenelId })
            .then((channelData) => {
              if (channelData) {
                return resolve;
                console.log(channelData);
              }
            });
        });
      }).then((resolve) => {
        console.log(resolve);
      });
      console.log(allVideos);
      res.json({ responseData: allVideos });
    }
  });
});

export default allVideos;
