import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import Routes from "./routes/routes.js";
import bodyParser from "body-parser";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import AuthToken from "./utils/verify-user/VerifyUser.js";
import multer from "multer";
import path from "path";
import { cloudinary } from "./utils/Cloudinary/Cloudinary.js";
import webrtc from "wrtc";
import socketFuncs from "./socket/socketFuncs.js";

let senderStream;
const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
//
dotenv.config();
app.use(cookieParser());
app.use(express.json());

cors(
  // { "Access-Control-Allow-Origin": `*` },
  "Access-Control-Allow-Methods: POST, PUT, PATCH, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers: Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
);

dbConnect();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGIN },
});

io.on("connection", (socket) => {
  socketFuncs(io, socket);
});
let users = {};

let socketToRoom = {};

const maximum = 2;

// io.on("connection", (socket) => {
//   socket.on("join_room", (data) => {
//     console.log("yes here");
//     if (users[data.room]) {
//       const length = users[data.room].length;
//       if (length === maximum) {
//         socket.to(socket.id).emit("room_full");
//         return;
//       }
//       users[data.room].push({ id: socket.id });
//     } else {
//       users[data.room] = [{ id: socket.id }];
//     }
//     socketToRoom[socket.id] = data.room;

//     socket.join(data.room);
//     console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

//     const usersInThisRoom = users[data.room].filter(
//       (user) => user.id !== socket.id
//     );

//     console.log(usersInThisRoom);

//     io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
//   });

//   socket.on("offer", (sdp) => {
//     console.log("offer: " + socket.id);
//     socket.broadcast.emit("getOffer", sdp);
//   });

//   socket.on("answer", (sdp) => {
//     console.log("answer: " + socket.id);
//     socket.broadcast.emit("getAnswer", sdp);
//   });

//   socket.on("candidate", (candidate) => {
//     console.log("candidate: " + socket.id);
//     socket.broadcast.emit("getCandidate", candidate);
//   });

//   socket.on("disconnect", () => {
//     console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
//     const roomID = socketToRoom[socket.id];
//     let room = users[roomID];
//     if (room) {
//       room = room.filter((user) => user.id !== socket.id);
//       users[roomID] = room;
//       if (room.length === 0) {
//         delete users[roomID];
//         return;
//       }
//     }
//     socket.broadcast.to(room).emit("user_exit", { id: socket.id });
//     console.log(users);
//   });
// });

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    // limit: "50mb",
    // parameterLimit: 100000,
    extended: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `*`);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS,  PUT,PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, scrolling, a_custom_header"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/", Routes);

app.post("/consumer", async ({ body }, res) => {
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  senderStream
    .getTracks()
    .forEach((track) => peer.addTrack(track, senderStream));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };
  console.log("here view");
  res.json(payload);
});

app.post("/broadcast", async ({ body }, res) => {
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:global.stun.twilio.com:3478?transport=udp",
      },
    ],
  });
  peer.ontrack = (e) => handleTrackEvent(e, peer);
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };
  console.log("here make");

  res.json(payload);
});

function handleTrackEvent(e, peer) {
  senderStream = e.streams[0];
}

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
