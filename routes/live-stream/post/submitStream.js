import webrtc from "wrtc";
import videoModal from "../../../db/schema/video.js";

const submitStream = async (req, res, allStreams) => {
  const { title, descreption } = req.body.videoData;
  const videoId = req.body.videoId;
  console.log(req.body);
  if (videoId) {
    const filter = { _id: videoId };
    const update = { descreption: descreption, title: title };
    videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
      if (resuel) {
        console.log("here is the data", update);
        res.json({ ready: true });
      }
    });
  }
};
export default submitStream;
