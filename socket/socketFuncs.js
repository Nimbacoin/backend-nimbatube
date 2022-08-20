import streamingVideo from "./streaming/streamingVideo.js";
const socketFuncs = (io, socket) => {
  io.on("connection", () => {
    streamingVideo(io, socket);
    console.log("connected");
  });
};

export default socketFuncs;
