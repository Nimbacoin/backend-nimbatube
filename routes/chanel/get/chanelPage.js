import express from "express";
import ChanelModal from "../../../db/schema/chanel.js";
import mongoose from "mongoose";
import User from "../../../db/schema/user.js";
const chanelPage = express.Router();

chanelPage.get("/get/chanel:chanelId", async (req, res) => {
  const userId = req.userId;
  const chanelId = req.params.chanelId;
  function onlyLettersAndNumbers(chanelId) {
    return /^[A-Za-z0-9]*$/.test(chanelId);
  }

  const IsCorrectId = onlyLettersAndNumbers();
  if (mongoose.Types.ObjectId.isValid(chanelId) && IsCorrectId) {
    console.log(chanelId);
    await ChanelModal.findOne({ _id: chanelId }).then((chanel) => {
      if (chanel) {
        console.log(chanel);
        res.json({
          responsData: chanel,
        });
      } else if (!chanel) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
    console.log(chanelId);

    res.end();
  }
});

export default chanelPage;
