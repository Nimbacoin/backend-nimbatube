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
import session from "express-session";
import ios from "socket.io-express-session";
const Session = new session({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
});
import sharedsession from "express-socket.io-session";

let senderStream;
const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
const ORIGINWWW = process.env.ORIGINWWW;
const ORIGINHTTP = process.env.ORIGINHTTP;
const ORIGINHTTPWWW = process.env.ORIGINHTTPWWW;
const ORIGINHTTPS = process.env.ORIGINHTTPS;
const ORIGINHTTPSWWW = process.env.ORIGINHTTPSWWW;
//
dotenv.config();
app.use(Session);

app.use(cookieParser());
app.use(express.json());

// cors(
//   // { "Access-Control-Allow-Origin": `*` },
//   "Access-Control-Allow-Methods: POST, PUT, PATCH, GET, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers: Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
// );

dbConnect();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origins: [
      `${ORIGIN}`,
      // `${ORIGINWWW}`,
      // `${ORIGINHTTP}`,
      // `${ORIGINHTTPWWW}`,
      `${ORIGINHTTPS}`,
      `${ORIGINHTTPSWWW}`,
    ],
  },
});
io.use(ios(Session));
io.use(
  sharedsession(Session, {
    autoSave: true,
  })
);

// io.on("connection", (socket) => {
//   socketFuncs(io, socket);
// });

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
//:
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
        urls: "stun:stun.l.google.com:19302",
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

//sdopsodpsdposopdpod
