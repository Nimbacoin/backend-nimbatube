import express from "express";
import chanelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const followingChannels = express.Router();
followingChannels.get("/", async (req, res) => {
  console.log("channels");
  const userId = req.userId;
  await User.findOne({ _id: userId }).then((docadded) => {
    console.log("is following");
    if (docadded) {
      chanelModal
        .find({
          followers: { $elemMatch: { id: userId } },
        })
        .then((channels) => {
          if (channels.length) {
            const allChannels = channels;
            const resChannel = [];
            allChannels.map((item) => {
              resChannel.push({ channelData: item, _id: item._id });
            });
            console.log("channels is here", "channels follwoing:", resChannel);
            res.json({ responseData: resChannel });
          } else {
            res.json({ responsMessage: "NoChanelFounded" });
          }
        });
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default followingChannels;
