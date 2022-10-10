import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";

allVideos.get("/", async (req, res) => {
  videoModal
    .find({
      duration: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$duration" }, 1] },
      title: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$title" }, 1] },
      thumbnail: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$thumbnail" }, 1] },
    })
    .limit(7)
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
