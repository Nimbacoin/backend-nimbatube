import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";

allVideos.get("/:length", async (req, res) => {
  let limitLength = req.params.length;
  let limit = Number(limitLength);
  console.log("here", limit);
  let skip = limit;
  if (limit <= 0) {
    console.log("this is the limit", limit);
    limit = 8;
    skip = 0;
    console.log("is small");
    console.log("this is the limit", limit);
  } else if (limit >= 8) {
    limit = limit + 4;
    skip = limit;
    console.log("is big", limit);
  } else {
    skip = limit;
  }
  console.log(limit);
  console.log(skip);
  let allVideoLength = 0;
  videoModal.countDocuments(
    {
      duration: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$duration" }, 1] },
      title: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$title" }, 1] },
      thumbnail: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$thumbnail" }, 1] },
    },
    function (err, count) {
      allVideoLength = count;
      console.log(count);
    }
  );
  console.log(allVideoLength);
  videoModal
    .find({
      duration: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$duration" }, 1] },
      title: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$title" }, 1] },
      thumbnail: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$thumbnail" }, 1] },
    })
    .skip(skip)
    .limit(limit)
    .then(async (allVideos) => {
      const vidoesData = allVideos;
      let dataFinal = [];
      let vidId;
      if (allVideos.length >= 1) {
        await Promise.all(
          vidoesData.map(async (vid, index) => {
            vidId = vid.channelId;
            await channelModal.findOne({ _id: vidId }).then(async (channel) => {
              const data = { channelData: channel, videoData: vid };
              await dataFinal.push(data);
            });
          })
        );
        console.log(dataFinal.length, limit);
        res.json({
          responseData: dataFinal.sort((a, b) => (a.index < b.index ? 1 : -1)),
          limit: limit,
          skip: skip,
        });
      } else {
        res.json({ responseData: [] });
      }
    });
});

export default allVideos;
//dfg
