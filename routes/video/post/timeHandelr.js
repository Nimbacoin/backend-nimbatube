// import { getVideoDurationInSeconds } from "get-video-duration";
import VideoTimeReader from "./timer.js";
import videoModal from "../../../db/schema/video.js";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
import fs from "fs";
const timeHandelr = async (Id, path) => {
  if (Id) {
    videoModal.findOne({ _id: Id }).then(async (video) => {
      if (video) {
        ffprobe(path, { path: ffprobeStatic.path }, (err, info) => {
          (async () => {
            if (err) return done(err);
            const numberDuration = info.streams[0].duration;
            if (typeof numberDuration !== "undefined") {
              const timeVideo = VideoTimeReader(parseInt(numberDuration));
              const filter = {
                _id: video._id,
              };
              const updateUser = {
                duration: timeVideo,
              };
              try {
                await videoModal.updateOne(filter, updateUser);
                fs.unlinkSync(path);
                //file removed
              } catch (error) {
              }
            }
          })();
        });
        // await getVideoDurationInSeconds(path).then(async (duration) => {
        // });
        // await getVideoDurationInSeconds(path).then(async (duration) => {
        //   const timeVideo = VideoTimeReader(duration);
        //   const filter = {
        //     _id: video._id,
        //   };
        //   const updateUser = {
        //     duration: timeVideo,
        //   };
        //   try {
        //     await videoModal.updateOne(filter, updateUser);
        //     fs.unlinkSync(path);
        //     //file removed
        //   } catch (error) {
        //   }
        // });
      }
    });
  }
};

export default timeHandelr;
