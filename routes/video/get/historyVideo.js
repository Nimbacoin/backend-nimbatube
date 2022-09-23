import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const historyVideo = express.Router();
import videoModal from "../../../db/schema/video.js";

historyVideo.get("/", async (req, res) => {
  console.log("here");
  let dataFinal = [];
  const userId = req.userId;
  //   await User.updateOne({ _id: userId }, { videoHistory: [] });
  await User.findOne({ _id: userId }).then(async (userData) => {
    if (userData) {
      const hisory = userData.videoHistory;
      console.log(hisory);
      let videoId;
      await Promise.all(
        hisory.map(async (item, index) => {
          videoId = item.id;
          await videoModal.findOne({ _id: videoId }).then(async (histyVid) => {
            let channelId;
            if (histyVid) {
              channelId = histyVid.channelId;
              await channelModal
                .findOne({ _id: channelId })
                .then(async (channel) => {
                  const data = {
                    index: index,
                    channelData: channel,
                    videoData: histyVid,
                  };
                  // console.log(data);

                  await dataFinal.push(data);
                });
            }
          });

          // res.json({ responseData: dataFinal });
        })
      );
      dataFinal.sort((a, b) => (a.index < b.index ? 1 : -1));
      console.log(dataFinal);
      res.json({ responseData: dataFinal });
    }
  });
});

export default historyVideo;