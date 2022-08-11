import express from "express";
import User from "../../../../db/schema/user.js";
import ChanelModal from "../../../../db/schema/chanel.js";
import uploadChanelImages from "../uploads/uploadChanelImages.js";
const createNewChanel = express.Router();

createNewChanel.post("/", async (req, res) => {
  const userId = req.userId;
  const { general, images } = req.body;
  const { title, name, description } = general;
  const { profileImage } = images;
  const { tags } = req.body;

  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded && typeof name !== "undefined") {
      if (typeof name !== "undefined") {
        const profileImg = await uploadChanelImages(profileImage);
        ChanelModal.create({
          creator: userId,
          chanelData: {
            title,
            name,
            description,
            profileImg: {
              url: profileImg.url,
              id: profileImg.public_id,
              asset_id: profileImg.asset_id,
            },
          },
        }).then((chanel) => {
          res.json({ "respons-data": chanel });
        });
      } else {
        res.json({
          message: "EnterChanelUserName",
        });
      }
    } else if (docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default createNewChanel;
