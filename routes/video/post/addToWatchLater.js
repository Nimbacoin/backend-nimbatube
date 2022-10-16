import express from "express";
import User from "../../../db/schema/user.js";
const addToWatchLater = express.Router();
import mongoose from "mongoose";
import videoModal from "../../../db/schema/video.js";
import channelModal from "../../../db/schema/channel.js";

addToWatchLater.post("/", (req, res) => {
  const videoId = req.body.videoId;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    const filter = { _id: videoId };
    videoModal.findOne(filter, async (error, resuel) => {
      if (resuel) {
        try {
          User.findOne({ _id: userId }).then(async (useData) => {
            const event = new Date();
            const userWatchLater = useData.watchLater;
            console.log("befor", userWatchLater.length);
            const newWatchLater = [
              ...userWatchLater,
              {
                id: videoId,
                createdAt: `${event}`,
              },
            ];

            const updateUser = { watchLater: newWatchLater };
            const filterUser = { _id: userId };
            await User.updateOne(filterUser, updateUser);
            await User.findOne(filterUser).then((userdata) => {
              if (userdata) {
                const dataWatchLater = userdata.watchLater.some(
                  ({ id }) => id === videoId
                );
                console.log(
                  "after",
                  userdata.watchLater.length,
                  dataWatchLater
                );
                res.json({ responseData: { favorites: dataWatchLater } });
              }
            });
          });
        } catch (error) {}
      }
    });
  }
});

export default addToWatchLater;
