// import the packages
import express from "express";
import mongoose from "mongoose";
import connectDB from "./services/db.js";
import cors from "cors";
import Grid from "gridfs-stream";
import dotenv from "dotenv";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import http from "http";
import crypto from "crypto";
import path from "path";
import Routes from "./routes/routes.js";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";

connectDB();
dotenv.config();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;

const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    // limit: "50mb",
    // parameterLimit: 100000,
    extended: true,
  })
);
app.use(cors());
await connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGIN },
});
io.on("connection", (socket) => {
  socket.on("stream", (image) => {
    socket.broadcast.emit("streaming", image);
  });
  socket.on("radio", function (blob) {
    // can choose to broadcast it to whoever you want
    socket.broadcast.emit("voice", blob);
  });
});

const mongoURL = process.env.MONGOCONNECT;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  console.log("db is connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "video",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("video");
});

const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "video",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// route for uploading a file
app.post("/upload", upload.single("file"), (req, res) => {
  res.json(req.file);
});

// route for fetching all the files from the video bucket

app.get("/files", async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();
    res.json(files);
  } catch (err) {
    res.status(400).send(err);
  }
});
// route for streaming a file
app.get("/read/:filename", async (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      console.log("non");
    }
    if (file) {
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});
app.delete("/delete/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    await gfs.files.remove({ filename });

    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
});
app.use("/", Routes);
// serves the application at the defined port
app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
