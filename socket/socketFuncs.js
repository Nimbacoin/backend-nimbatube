import streamingVideo from "./streaming/streamingVideo.js";
let users = {};

let socketToRoom = {};

const maximum = 2;
const usersInThisRoom = [];

const socketFuncs = (io, socket) => {
  // socket.broadcast.emit("users", usersInThisRoom);

  socket.on("create_room", (data) => {
    socket.join(data.roomId);
    usersInThisRoom.push({ id: data.roomId });
    io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
    //  socket.broadcast.emit("users", usersInThisRoom);
  });
  socket.on("join_room", (data) => {
    socket.join(data.roomId);
    console.log(data.roomId);
    io.to(socket.id).emit("all_users", usersInThisRoom);
    //socket.broadcast.emit("all_users", usersInThisRoom);
  });

  socket.on("offer", (sdp) => {
    console.log("offer: " + socket.id);
    socket.broadcast.emit("getOffer", sdp);
  });

  socket.on("answer", (sdp) => {
    console.log("answer: " + socket.id);
    socket.broadcast.emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate) => {
    console.log("candidate: " + socket.id);
    socket.broadcast.emit("getCandidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    socket.broadcast.to(room).emit("user_exit", { id: socket.id });
    console.log(users);
  });

  // let bords;
  // socket.on("broadcaster", (id) => {
  //   const broadcaster = id;
  //   console.log("broadcaster set", broadcaster);
  //   socket.emit("broadcaster", broadcaster);
  // });

  // socket.on("new-broadcaster", (broadcaster) => {
  //   socket.broadcast.emit("active-broadcaster", broadcaster);
  //   bords = broadcaster;
  //   console.log("active-broadcaster emitted", broadcaster);

  //   socket.broadcast.emit("here-is-all-ids", broadcaster);
  // });
  // socket.on("users", () => {
  //   socket.broadcast.emit("here-is-all-ids", bords);
  // });
  // const Room = "23456543234565434567654345678";
  // let isAnswered = false;
  // socket.on("create-room", () => {
  //   socket.join(Room);
  //   socket.emit("room-ctreated");
  //   console.log("room created", Room);
  // });

  // socket.on("joining-room", () => {
  //   socket.join(Room);
  //   socket.emit("joined-the-room");
  //   console.log("joied a room", Room);
  // });

  // socket.on("ready", (room) => {
  //   socket.broadcast.to(Room).emit("ready", "world");
  //   console.log("ready");
  // });

  // socket.on("offer", (event) => {
  //   socket.broadcast.emit("offer", event.sdp);
  //   socket.broadcast.to(Room).emit("offer", event.sdp);
  //   // socket.broadcast.emit("answer", event.sdp);

  //   console.log("offer");
  // });
  // socket.on("answer", (event) => {
  //   console.log("answer");
  //   socket.broadcast.to(Room).emit("answer", event.sdp);

  //   // socket.broadcast.emit("answer", event.sdp);
  // });

  // socket.on("candidate", (event) => {
  //   socket.broadcast.emit("candidate", event);
  //   console.log("candidate");
  // });
};

export default socketFuncs;

// streamingVideo(io, socket);
