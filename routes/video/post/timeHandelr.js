import { getVideoDurationInSeconds } from "get-video-duration";
import videoModal from "../../../db/schema/video.js";
import VideoTimeReader from "./timer.js";

const timeHandelr = async (Id, path) => {
  console.log(Id, path);
  if (Id) {
    videoModal.findOne({ _id: Id }).then(async (video) => {
      if (video) {
        console.log(video);
        await getVideoDurationInSeconds(path).then(async (duration) => {
          const timeVideo = VideoTimeReader(duration);
          console.log(timeVideo);
          const filter = {
            _id: video._id,
          };
          const updateUser = {
            duration: timeVideo,
          };

          try {
            await videoModal.updateOne(filter, updateUser);
             // try {
            //   fs.unlinkSync(path);
            //   //file removed
            // } catch (err) {
            //   console.error(err);
            // }
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  }
};

export default timeHandelr;
