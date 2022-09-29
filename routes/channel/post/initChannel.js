import express from "express";
import User from "../../../db/schema/user.js";
import channelModal from "../../../db/schema/channel.js";
import uploadChannelImages from "./uploads/uploadChannelImages.js";
import uploadChannelCoverImages from "./uploads/uploadChannelCoverImages.js";
const initChannel = express.Router();

initChannel.post("/", async (req, res) => {
  const userId = req.userId;
  console.log("init");
  await User.findOne({ _id: userId }).then(async (docadded) => {
    channelModal
      .create({
        creator: userId,
      })
      .then((channel) => {
        // console.log(channel);

        res.json({ responsData: channel });
      });
  });
});

export default initChannel;
