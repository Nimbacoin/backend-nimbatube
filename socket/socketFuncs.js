import videoModal from "../db/schema/video.js";
import notification from "./notification.js";
import streamingVideo from "./streaming/streamingVideo.js";

let rooms = [];
let broadcaster;

const socketFuncs = (io, socket) => {
  notification(io, socket);
  // socket.emit("new-comment", []);
  socket.on("new-comment", (commentData) => {
    const roomId = commentData.videoId;
    const filtered = rooms.filter((rm) => rm.roomId === roomId);
    filtered.map((roomData) => {
      const userStreamerId = roomData.socketId;
      socket.to(userStreamerId).emit("new-comment", commentData.comments);
      io.to(userStreamerId).emit("new-comment", commentData.comments);
      const viewers = roomData.viewers;
      console.log(viewers);
      if (viewers?.length) {
        viewers.map(({ socketId }) => {
          if (socketId) {
            socket.to(socketId).emit("new-comment", commentData.comments);
          }
        });
      }
    });
  });
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

  socket.on("watcher", ({ videoId }) => {
    const filtered = rooms.filter((rm) => rm.roomId === videoId);
    const filteredIndex = rooms.findIndex((rm) => rm.roomId === videoId);
    let viewers = rooms[filteredIndex]?.viewers;
    const isIn = viewers?.some((m) => m.socketId === socket.id);
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
    console.log("make offer");
    socket.to(id).emit("offer", socket.id, message);
  });
  console.log("make answer answer");
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    console.log("answer sent");
  });
  socket.on("candidate", (id, message) => {
    console.log("make answer answer");
    socket.to(id).emit("candidate", socket.id, message);
    console.log("candidate", id);
  });

  socket.on("close", () => {
    console.log("closed socket");
  });

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
    socket.join(data.room);
  });

  socket.on("leave room", (data) => {
    console.log("leaving room");
    socket.leave(data.room);
  });
  socket.on("disconnect", (data) => {
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
        socket.to(socketId).emit("watcher-leave", {
          viewers,
        });
      }
      viewers.map(({ socketId }) => {
        if (socket.id === socketId) {
          console.log(socketId, socket.id);
        }
      });
    });
  });
};

export default socketFuncs;
