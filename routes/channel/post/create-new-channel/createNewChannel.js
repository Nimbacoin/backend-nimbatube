import express from "express";
import User from "../../../../db/schema/user.js";
import ChannelModal from "../../../../db/schema/channel.js";
import uploadChannelImages from "../uploads/uploadChannelImages.js";
import uploadChannelCoverImages from "../uploads/uploadChannelCoverImages.js";
const createNewChannel = express.Router();

createNewChannel.post("/", async (req, res) => {
  const userId = req.userId;
  const { general, images } = req.body;
  const { title, name, description } = general;
  const { profileImage, coverImage } = images;
  const { tags } = req.body;
  console.log(general);
  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded && typeof name !== "undefined") {
      if (typeof name !== "undefined") {
        const profileImg = await uploadChannelImages(profileImage);
        const coverImg = await uploadChannelCoverImages(coverImage);
        // console.log(coverImg);
        ChannelModal.create({
          creator: userId,
          channelData: {
            title,
            name,
            description,
            profileImg: {
              url: profileImg.url,
              id: profileImg.public_id,
              asset_id: profileImg.asset_id,
            },
            coverImg: {
              url: coverImg.url,
              id: coverImg.public_id,
              asset_id: coverImg.asset_id,
            },
          },
        }).then((channel) => {
          console.log(channel);
          res.json({ "respons-data": channel });
        });
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
  });
});

export default createNewChannel;
