import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";

allVideos.get("/:length", async (req, res) => {
  let limitLength = req.params.length;
  let limit = Number(limitLength);
  let skip = limit;
  if (limit <= 0) {
    limit = 8;
    skip = 0;
    
  } else if (limit >= 8) {
    limit = limit + 4;
    skip = limit;
  } else {
    skip = limit;
  }
  
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
    }
  );
  // .skip(0)
  // .limit(1)

  videoModal
    .find({
      duration: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$duration" }, 1] },
      title: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$title" }, 1] },
      thumbnail: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$thumbnail" }, 1] },
    })
    .then(async (allVideos) => {
      const vidoesData = allVideos;
      let dataFinal = [];
      let vidId;
      if (allVideos.length >= 1) {
        await Promise.all(
          vidoesData.map(async (vid, index) => {
            vidId = vid.channelId;
            await channelModal.findOne({ _id: vidId }).then(async (channel) => {
              const data = {
                index: index,
                channelData: channel,
                videoData: vid,
              };
              await dataFinal.push(data);
            });
          })
        );

        // if (limit <= allVideoLength) {
        //shuffledArray = array.sort((a, b) => 0.5 - Math.random());
        //sort by date .sort((a, b) => (a.index < b.index ? 1 : -1)),
        res.json({
          responseData: dataFinal.sort((a, b) => 0.5 - Math.random()),
          limit: limit,
          skip: skip,
        });
        // } else {
        //   res.json({
        //     responseData: [],
        //     limit,
        //     skip: skip,
        //   });
        // }
      } else {
        res.json({ responseData: [] });
      }
    });
});

export default allVideos;
//dfg
