import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const historyVideo = express.Router();
import videoModal from "../../../db/schema/video.js";

historyVideo.get("/", async (req, res) => {
  console.log("here");
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (userData) => {
    let dataFinal = [];
    const hisory = userData.historyVideo;
    if (userData) {
      await videoModal.find({}).then(async (histyVid) => {
        const vidoesData = histyVid;
        let vidId;
        if (histyVid) {
          await Promise.all(
            vidoesData.map(async (vid, index) => {
              vidId = vid.channelId;
              await channelModal
                .findOne({ _id: vidId })
                .then(async (channel) => {
                  const data = { channelData: channel, videoData: vid };
                  // console.log(data);
                  await dataFinal.push(data);
                });
            })
          );
          res.json({ responseData: dataFinal });
        }
      });
    }
  });
});

export default historyVideo;
