import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import dbConnect from "./db/dbConnect.js";
// import Routes from "./routes/routes.js";
import mongoose from "mongoose";
import axios from "axios";
import Routes from "./routes/routes.js";

//config the appp
const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
console.log(ORIGIN);
dotenv.config();
console.log("main_origin is ");
cors(
  { "Access-Control-Allow-Origin": "*" },
  "Access-Control-Allow-Methods: POST, PUT, PATCH, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers: Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
);

//db conncet
dbConnect();
// create server

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGIN },
});
// concect app

app.use(express.json());

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
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/", Routes);
app.get("/", (req, res) => {
  console.log("main");
  res.json("ES");
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
