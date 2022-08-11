import express from "express";
import User from "../../../../db/schema/user.js";
import ChanelModal from "../../../../db/schema/chanel.js";
import { cloudinary } from "../../../../utils/Cloudinary/Cloudinary.js";
const uploadChanelImages = express.Router();

uploadChanelImages.post("/", async (req, res) => {
  const userId = req.userId;
  // console.log("here is the req", req.body.data);

  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded) {
      console.log(process.env.CLOUDINARY_URL);
      try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: "profiles_nimbatube",
        });
        console.log(uploadResponse);
        res.json({ msg: "yaya" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
      }
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default uploadChanelImages;
