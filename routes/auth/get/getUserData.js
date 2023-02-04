import express from "express";
import mongoose from "mongoose";
import userModal from "../../../db/schema/user.js";
const getUserData = express.Router();

getUserData.get("/", async (req, res) => {
  console.log("main from here");
  const reqUserId = req.userId;
  var converData = [];
  if (mongoose.Types.ObjectId.isValid(reqUserId)) {
    await userModal.findOne({ _id: reqUserId }).then(async (userVerfied) => {
      res.json({ responseData: { userData: userVerfied } });
    });
  }
});

// converData.sort(
//   (x, y) =>
//     -new Date(x.lastmessage.createdAt) -
//     -new Date(y.lastmessage.createdAt)
// );
export default getUserData;
