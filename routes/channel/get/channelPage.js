import express from "express";
import channelModal from "../../../db/schema/channel.js";
import mongoose from "mongoose";
import User from "../../../db/schema/user.js";
import commentModal from "../../../db/schema/comment.js";
const channelPage = express.Router();

channelPage.get("/get/channel:channelId", async (req, res) => {
  const userId = req.userId;

  const channelId = req.params.channelId;
  function onlyLettersAndNumbers(channelId) {
    return /^[A-Za-z0-9]*$/.test(channelId);
  }
  console.log(userId, channelId);

  const IsCorrectId = onlyLettersAndNumbers();
  if (channelId && mongoose.Types.ObjectId.isValid(channelId) && IsCorrectId) {
    await channelModal.findOne({ _id: channelId }).then(async (channel) => {
      if (channel) {
        const channelData = [channel];
        const comments = [];
        await Promise.all(
          channelData[0].community.map(async (com, index) => {
            let comId = com.id;
            if (mongoose.Types.ObjectId.isValid(comId))
              await commentModal
                .findOne({ _id: comId })
                .then(async (commentData) => {
                  await channelModal
                    .findOne({ creator: commentData.creatore })
                    .then(async (channel) => {
                      const data = {
                        commentData: commentData,
                        creatoreData: channel?.channelData,
                      };
                      data.commentData.creatore = null;
                      await comments.push(data);
                    });
                });
          })
        );
        channelData[0].community = comments;
        res.json({
          responsData: channelData[0],
        });
      } else if (!channel) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
    res.end();
  }
});

export default channelPage;
