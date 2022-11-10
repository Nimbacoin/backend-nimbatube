import { getVideoDurationInSeconds } from "get-video-duration";
import videoModal from "../../../db/schema/video.js";
import VideoTimeReader from "./timer.js";

const timeHandelr = async (Id) => {
  if (Id) {
    videoModal
      .findOne({
        _id: Id,
      })
      .then(async (video) => {
        if (video) {
          // console.log(video);
          await getVideoDurationInSeconds(video.location).then(
            async (duration) => {
              const timeVideo = VideoTimeReader(duration);
              const filter = {
                _id: video._id,
              };
              const updateUser = {
                duration: timeVideo,
              };
              // console.log(duration);

              // console.log(timeVideo);
              try {
                await videoModal.updateOne(filter, updateUser);
              } catch (error) {
                console.log(error);
              }
            }
          );
        }
      });
  }
};

export default timeHandelr;
