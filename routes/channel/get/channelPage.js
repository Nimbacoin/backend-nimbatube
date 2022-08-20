import express from "express";
import ChannelModal from "../../../db/schema/channel.js";
import mongoose from "mongoose";
import User from "../../../db/schema/user.js";
const channelPage = express.Router();

channelPage.get("/get/channel:channelId", async (req, res) => {
  const userId = req.userId;
  const channelId = req.params.channelId;
  function onlyLettersAndNumbers(channelId) {
    return /^[A-Za-z0-9]*$/.test(channelId);
  }

  const IsCorrectId = onlyLettersAndNumbers();
  if (mongoose.Types.ObjectId.isValid(channelId) && IsCorrectId) {
    await ChannelModal.findOne({ _id: channelId }).then((channel) => {
      if (channel) {
        res.json({
          responsData: channel,
        });
      } else if (!channel) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
    res.end();
  }
});

export default channelPage;
