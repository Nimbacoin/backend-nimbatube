import { getVideoDurationInSeconds } from "get-video-duration";
import videoModal from "../../../db/schema/video.js";
import VideoTimeReader from "./timer.js";

const timeHandelr = async (url) => {
  videoModal
    .find({
      duration: { $exists: false },
      location: { $exists: true },
      $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
    })
    .then(async (videos) => {
      if (videos && videos.length >= 1) {
        videos.map(async (video) => {
          await getVideoDurationInSeconds(video.location).then(
            async (duration) => {
              const timeVideo = VideoTimeReader(duration);
              const filter = {
                id: video._id,
              };
              const updateUser = {
                duration: timeVideo,
              };
              console.log(duration);

              console.log(timeVideo);
              try {
                await videoModal.updateOne(filter, updateUser);
              } catch (error) {
                console.log(error);
              }
            }
          );
        });
      }
    });
};

export default timeHandelr;
