import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";

allVideos.get("/", async (req, res) => {
  videoModal
    .find()
    .limit(8)
    .then(async (allVideos) => {
      const vidoesData = allVideos;
      let dataFinal = [];
      let vidId;
      if (allVideos.length >= 1) {
        await Promise.all(
          vidoesData.map(async (vid, index) => {
            vidId = vid.channelId;
            await channelModal.findOne({ _id: vidId }).then(async (channel) => {
              const data = { channelData: channel, videoData: vid };
              // console.log(data);
              await dataFinal.push(data);
            });
          })
        );
        res.json({
          responseData: dataFinal.sort((a, b) => (a.index < b.index ? 1 : -1)),
        });
      } else {
        res.json({ responseData: [] });
      }
    });
});

export default allVideos;
