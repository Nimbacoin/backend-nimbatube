import makeStream from "./makeStream.js";
import watchStream from "./watchStream.js";

let liveStreamers = [];
const streamingVideo = (io, socket) => {
  watchStream(io, socket, liveStreamers);
  makeStream(io, socket, liveStreamers);
};

export default streamingVideo;
