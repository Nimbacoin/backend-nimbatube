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
          // const profileImg =
          // await uploadChannelImages(profileImage);
          // const coverImg =""
          //  await uploadChannelCoverImages(coverImage);
          try {
            const update = {
              channelData: {
                title,
                name,
                description,
                // profileImg: {
                //   url: profileImg.url,
                //   id: profileImg.public_id,
                //   asset_id: profileImg.asset_id,
                // },
                // coverImg: {
                //   url: coverImg.url,
                //   id: coverImg.public_id,
                //   asset_id: coverImg.asset_id,
                // },
              },
            };
            const filter = { _id: channelId };

            await channelModal
              .findOne({ _id: channelId })
              .then(async (channel) => {
                if (channel.creator === userId) {
                  await channelModal.updateOne(filter, update);
                  res.json({ responsData: channel });
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
