import express from "express";
import mongoose from "mongoose";
import chanelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allChannels = express.Router();

allChannels.get("/", async (req, res) => {
  const userId = req.userId;
  console.log("all channels sent");
  if (mongoose.Types.ObjectId.isValid(userId)) {
    await User.findOne({ _id: userId }).then((docadded) => {
      if (docadded) {
        chanelModal.find({ creator: userId }).then((channels) => {
          if (channels.length) {
            channels.map((item) => {
              // console.log(item);
              console.log("channels is here", "channels");
            });
            res.json({ responsData: channels });
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
  } else {
    console.log("SD");
  }
});

export default allChannels;
