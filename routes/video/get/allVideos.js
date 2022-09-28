import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";

allVideos.get("/", async (req, res) => {
  console.log("helo");
  videoModal.find({}).then(async (allVideos) => {
    const vidoesData = allVideos;
    let dataFinal = [];
    let vidId;
    if (allVideos) {
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
      // dataFinal.sort((a, b) => (a.index < b.index ? 1 : -1));

      res.json({ responseData: dataFinal.splice(0, 10) });
    }
  });
});

export default allVideos;
