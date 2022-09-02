import videoModal from "../db/schema/video.js";
import streamingVideo from "./streaming/streamingVideo.js";

let rooms = [];
let broadcaster;

const socketFuncs = (io, socket) => {
  socket.broadcast.emit("new-broadcaster", broadcaster);
  socket.on("broadcaster", async ({ socketId, videoId }) => {
    broadcaster = socketId;
    socket.emit("broadcaster", broadcaster);
    if (videoId) {
      const filter = { _id: videoId };
      const update = {
        streaming: {
          socketId: socketId,
          created: true,
          isLive: true,
        },
      };
      videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
        if (resuel) {
          socket.broadcast.emit("new-broadcaster", socket.id);
        }
      });
    }
    const roomId = videoId;
    socket.join(roomId);
    const filtered = rooms.findIndex((rm) => rm.roomId === roomId);
    if (filtered >= 0) {
      rooms[filtered].socketId = socket.id;
      console.log("hey ", roomId, "socket changed", socket.id);
    } else if (filtered < 0) {
      rooms.push({
        roomId,
        socketId: socket.id,
        viewers: [],
      });
      console.log("hey ", roomId, "you just creatd your room");
    }
    socket.broadcast.emit("new-broadcaster", socket.id);
  });

  socket.on("watcher", ({ broadcasterId, videoId }) => {
    const filtered = rooms.filter((rm) => rm.roomId === videoId);
    const filteredIndex = rooms.findIndex((rm) => rm.roomId === videoId);
    let viewers = rooms[filteredIndex].viewers;
    const isIn = viewers.some((m) => m.socketId === socket.id);
    console.log(isIn);
    if (filtered.length >= 1 && !isIn) {
      if (viewers.length >= 1) {
        rooms[filteredIndex].viewers.push({ socketId: socket.id });
      } else {
        rooms[filteredIndex].viewers = [{ socketId: socket.id }];
      }
      const roomSocketId = filtered[0].socketId;

      socket.to(roomSocketId).emit("watcher", {
        id: socket.id,
        viewers: rooms[filteredIndex].viewers,
      });
    }
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    console.log("answer sent");
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
    console.log("candidate", id);
  });

  socket.on("close", () => {
    console.log("closed socket");
  });

  // socket.on("new-broadcaster", (broadcaster) => {
  //   socket.broadcast.emit("active-broadcaster", broadcaster);
  //   console.log("active-broadcaster emitted");
  // });

  socket.on("watcher-disconnect", () => {
    console.log("watcher disconnected");
    socket.emit("disconnectPeer", socket.id);
  });

  socket.on("new message", (data) => {
    console.log(data.room);
    socket.broadcast.to(data.room).emit("receive message", data);
  });
  socket.on("room", (data) => {
    console.log("room join");
    console.log(data);
    socket.join(data.room);
  });

  socket.on("leave room", (data) => {
    console.log("leaving room");
    console.log(data);
    socket.leave(data.room);
  });
  socket.on("disconnect", (data) => {
    // console.log("disconnect", socket.id);
    rooms.map(({ viewers, socketId }) => {
      const findIndexLeaver = viewers.findIndex(
        (useeer) => useeer.socketId === socket.id
      );
      if (findIndexLeaver >= 0) {
        var address = socket.handshake.address;
        console.log(
          "New connection from " + address.address + ":" + address.port
        );
        viewers.splice(findIndexLeaver, 1);
        console.log("yes", findIndexLeaver);
        socket.to(socketId).emit("watcher-leave", {
          viewers,
        });
      }
      viewers.map(({ socketId }) => {
        if (socket.id === socketId) {
          console.log("yes");
          console.log(socketId, socket.id);
        }
      });
    });
    //console.log(data);
    // socket.leave(data.room);
  });
};

export default socketFuncs;

// streamingVideo(io, socket);
