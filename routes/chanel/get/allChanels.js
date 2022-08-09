import express from "express";
import ChanelModal from "../../../db/schema/chanel.js";
import User from "../../../db/schema/user.js";
const allChanels = express.Router();

allChanels.get("/", async (req, res) => {
  const userId = req.userId;
  console.log("here");
  await User.findOne({ _id: userId }).then((docadded) => {
    if (docadded) {
      ChanelModal.find({ creator: userId }).then((chanels) => {
        if (chanels.length) {
          res.json({ responsData: chanels });
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

export default allChanels;
