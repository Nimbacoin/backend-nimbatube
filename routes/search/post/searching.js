import express from "express";
import User from "../../../db/schema/user.js";
const searching = express.Router();

searching.post("/", async (req, res) => {
  const userId = req.userId;
  console.log("remove channel");
  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded) {
      try {
      } catch (error) {
        return null;
      }
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default searching;
