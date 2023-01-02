import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
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

//:

app.use("/", (req, res) => {
  res.json("ER");
});
server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
