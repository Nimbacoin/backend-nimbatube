import express from "express";
import chanelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const followingChannels = express.Router();
followingChannels.get("/", async (req, res) => {
  const userId = req.userId;
  console.log("followingChannels");
  await User.findOne({ _id: userId }).then((docadded) => {
    if (docadded) {
      chanelModal
        .find({ followers: { $in: [{ id: userId }] } })
        .then((channels) => {
          console.log(channels);
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

export default followingChannels;
