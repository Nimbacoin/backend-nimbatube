import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import Routes from "./routes/routes.js";
import bodyParser from "body-parser";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import { cloudinary } from "./utils/Cloudinary/Cloudinary.js";
import socketFuncs from "./socket/socketFuncs.js";
import addRequestId from "express-request-id";

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(addRequestId());

cors(
  { "Access-Control-Allow-Origin": `*` },
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

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
