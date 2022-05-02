import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import dbConnect from "./db/dbConnect.js";
import Message from "./db/schema/Message.js";

//config the appp
const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
dotenv.config();
cors();

// create server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGIN },
});

//concect app
let docs;
app.get("/", (req, res) => {
  res.json("hey");
});
io.on("connection", async (socket) => {
  const transport = socket.conn.transport.name; // in most cases, "polling"
  socket.conn.on("upgrade", () => {
    const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
  });
  console.log("client connected: ", socket.id);
  socket.on("send-message", async (message) => {
    dbConnect();
    console.log(message);
    await Message.create({ message: message }).then(async (doc) => {
      socket.broadcast.emit("messagesssssssssssssssssssssss", doc);
      socket.emit("messagesssssssssssssssssssssss", doc);
      docs = doc;
    });
  });
  dbConnect();
  const data = await Message.find({});
  console.log(data);
  socket.emit("send-all-messages", data);

  //   dbConnect();
  //   docs = await Message.find();
  //   socket.broadcast.emit("messagesssssssssssssssssssssss", docs);
  //   socket.emit("messagesssssssssssssssssssssss", docs);
  //   console.log("message:", docs);
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
