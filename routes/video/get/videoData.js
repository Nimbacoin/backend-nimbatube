import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const videoData = express.Router();
import videoModal from "../../../db/schema/video.js";
import https from "http";
import axios from "axios";
//df
videoData.get("/get/video/:videoId/:unique_id", async (req, res) => {
  const unique_id = req.params.unique_id;
  const videoId = req.params.videoId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    videoModal.findOne({ _id: videoId }).then((video) => {
      if (video) {
        const views = video?.views;
        const filter = { _id: videoId };
        let update = { views: [...views, { id: unique_id }] };
        videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
          if (resuel) {
            res.json({ responseData: resuel, getting: unique_id });
          }
        });
      }
    });
  }
});

export default videoData;
