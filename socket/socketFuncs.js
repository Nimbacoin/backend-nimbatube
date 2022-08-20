import streamingVideo from "./streaming/streamingVideo.js";
const socketFuncs = (io, socket) => {
  io.on("connection", () => {
    streamingVideo(io, socket);
  });
};

export default socketFuncs;
