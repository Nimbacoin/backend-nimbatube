import express from "express";
import User from "../../../db/schema/user.js";
const addToFavorites = express.Router();
import mongoose from "mongoose";
import videoModal from "../../../db/schema/video.js";
import channelModal from "../../../db/schema/channel.js";

addToFavorites.post("/", (req, res) => {
  const videoId = req.body.videoId;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    const filter = { _id: videoId };
    videoModal.findOne(filter, async (error, resuel) => {
      if (resuel) {
        try {
          User.findOne({ _id: userId }).then(async (useData) => {
            const event = new Date();
            const userFavorites = useData.favorites;
            const newFavorites = [
              ...userFavorites,
              {
                id: videoId,
                createdAt: `${event}`,
              },
            ];

            const updateUser = { favorites: newFavorites };
            const filterUser = { _id: userId };
            await User.updateOne(filterUser, updateUser);
            await User.findOne(filterUser).then((userdata) => {
              if (userdata) {
                const dataFavorites = userdata.favorites.some(
                  ({ id }) => id === videoId
                );
                res.json({ responseData: { favorites: dataFavorites } });
              }
            });
          });
        } catch (error) {}
      }
    });
  }
});

export default addToFavorites;
