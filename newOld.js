import express from "express";
import bodyParser from "body-parser";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import Routes from "./routes/routes.js";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import AuthToken from "./utils/verify-user/VerifyUser.js";
import uploadChanelImages from "./routes/chanel/post/uploads/uploadChanelImages.js";
import multer from "multer";
import { cloudinary } from "./utils/Cloudinary/Cloudinary.js";
import fileUpload from "express-fileupload";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
dbConnect();
app.use(express.json());
// app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
const mongoURI = process.env.MONGOCONNECT;
const conn = mongoose.createConnection(mongoURI);
let gfs, gridfsBucket;

conn.once("open", () => {
  console.log("db is connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGIN },
});
io.on("connection", (socket) => {
  console.log("someone is connected");
  socket.on("stream", (image) => {
    socket.broadcast.emit("streaming", image);
  });
  socket.on("radio", function (blob) {
    // can choose to broadcast it to whoever you want
    socket.broadcast.emit("voice", blob);
  });
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});
app.get("/image/:filename", (req, res) => {
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

app.use("/", Routes);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
