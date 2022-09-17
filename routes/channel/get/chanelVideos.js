import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
import videoModal from "../../../db/schema/video.js";
const channelVideos = express.Router();

channelVideos.get("/get/channel/all-vidoes/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  await channelModal.findOne({ _id: channelId }).then((channelData) => {
    videoModal.find({ channelId: channelData._id }).then(async (allVideos) => {
      const vidoesData = allVideos;
      let dataFinal = [];
      if (allVideos) {
        await Promise.all(
          vidoesData.map(async (vid, index) => {
            const data = { channelData: channelData, videoData: vid };
            await dataFinal.push(data);
          })
        );
        res.json({ responseData: dataFinal });
      }
    });
  });
});

export default channelVideos;
