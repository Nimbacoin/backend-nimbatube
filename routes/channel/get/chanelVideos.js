import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
import videoModal from "../../../db/schema/video.js";
const channelVideos = express.Router();

channelVideos.get("/get/channel/all-vidoes/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  const channelData = await channelModal.findOne({ _id: channelId });
  console.log(channelData);
  videoModal.find({ channelId: channelId }).then((allVideos) => {
    if (allVideos.length && channelData) {
      res.json({ responseData: allVideos, channelData: channelData });
    }
  });
});

export default channelVideos;
