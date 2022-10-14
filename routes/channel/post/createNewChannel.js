import express from "express";
import User from "../../../db/schema/user.js";
import channelModal from "../../../db/schema/channel.js";
import uploadChannelImages from "./uploads/uploadChannelImages.js";
import uploadChannelCoverImages from "./uploads/uploadChannelCoverImages.js";
import mongoose from "mongoose";
const createNewChannel = express.Router();

createNewChannel.post("/", async (req, res) => {
  const userId = req.userId;
  const { general, images } = req.body;
  const { title, name, description } = general;
  const { profileImage, coverImage } = images;
  const channelId = req.body.channelId;
  const { tags } = req.body;

  console.log(channelId);

  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (mongoose.Types.ObjectId.isValid(channelId)) {
      if (docadded && typeof name !== "undefined") {
        if (typeof name !== "undefined") {
          const filter = { _id: channelId };
          try {
            const update = {
              channelData: {
                title,
                name,
                description,
              },
            };
            await channelModal.findOne(filter).then(async (doc) => {
              var update = doc;
              update.channelData.title = title;
              update.channelData.name = name;
              update.channelData.title = description;
              if (doc && doc.creator === userId) {
                await channelModal.updateOne(filter, update);
                res.json({ uploaded: true, responsData: doc });
              }
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          res.json({
            message: "EnterChannelUserName",
          });
        }
      } else if (docadded) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    }
  });
});

export default createNewChannel;
