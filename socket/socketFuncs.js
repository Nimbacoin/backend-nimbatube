import streamingVideo from "./streaming/streamingVideo.js";
let users = [];

let rooms = [];
let broadcaster;
const socketFuncs = (io, socket) => {
  socket.on("broadcaster", (id) => {
    broadcaster = id;
    console.log("broadcaster set", broadcaster);
    socket.emit("broadcaster", broadcaster);
    socket.broadcast.emit("new-broadcaster", socket.id);
  });
  socket.on("watcher", (broadcasterId) => {
    socket.to(broadcasterId).emit("watcher", socket.id);
    console.log("watcher set", socket.id);
    console.log("broadcasterId", broadcasterId);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
    console.log("offer sent", message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    console.log("answer sent");
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
    console.log("candidate", message);
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
  // socket.on("cearte_room", (data) => {
  //   const roomId = data.room;
  //   socket.join(data.room);
  //   const filtered = rooms.filter((rm) => rm.roomId === data.room);
  //   if (filtered.length) {
  //     rooms[0].socketId = socket.id;
  //     rooms[0].room = roomId;
  //     console.log("hey ", data.room, "socket changed", socket.id);
  //   } else if (roomId.length) {
  //     rooms.push({
  //       room: data.room,
  //       socketId: socket.id,
  //     });
  //     console.log("hey ", data.room, "you just creatd your room");
  //     console.log(rooms);
  //   }
  //   users.push({ userId: data.room, socketId: socket.id });
  // });
  // socket.on("join_room", (data) => {
  //   const roomId = data.room;

  //   if (users.length <= 1 && rooms.length >= 1 && roomId.length) {
  //     users.push({ userId: data.room, socketId: socket.id });
  //     socket.join(data.room);
  //     console.log("hey ", data.room, "you just joined a  room");
  //   }

  //   io.sockets.to(socket.id).emit("all_users", users);
  // });

  // socket.on("offer", (data) => {
  //   console.log("offer: " + data.user);
  //   const socketId = rooms[0]?.socketId;
  //   // if (socketId) {
  //   //   console.log("offered to : streamer" + socketId, "rooms", rooms);
  //   //   io.to(socketId).emit("getOffer", data.sdp);
  //   //   io.to(socket.id).emit("getOffer", data.sdp);
  //   // }
  //   console.log
  //   socket.broadcast.emit("getOffer", data.sdp);
  // });

  // socket.on("answer", (data) => {
  //   console.log("answer: ", data.user);
  //   socket.broadcast.emit("getAnswer", data.mySdp);
  // });

  // socket.on("candidate", (candidate) => {
  //   console.log("candidate: " + socket.id);
  //   socket.broadcast.emit("getCandidate", candidate);
  // });

  // socket.on("disconnect", () => {
  //   const filtered = rooms.filter((rm) => rm.socketId === socket.id);
  //   const filteredUsers = users.filter((rm) => rm.socketId === socket.id);
  //   const userIndex = users.findIndex((user) => user.socketId === socket.id);
  //   if (filtered.length >= 1) {
  //     rooms = [];
  //     console.log("you just delete your room");
  //     console.log(rooms);
  //   }
  //   if (filteredUsers.length >= 1 && userIndex >= 0) {
  //     users.splice(userIndex, 1);
  //     console.log("you just desconncted");
  //     console.log("users", users);
  //   }
  // });
};

export default socketFuncs;

// streamingVideo(io, socket);
