import express from "express";
import ChanelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allChannels = express.Router();

allChannels.get("/", async (req, res) => {
  const userId = req.userId;
  await User.findOne({ _id: userId }).then((docadded) => {
    if (docadded) {
      ChanelModal.find({ creator: userId }).then((channels) => {
        if (channels.length) {
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
});

export default allChannels;
