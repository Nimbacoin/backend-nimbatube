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
import uploadChanelImages from "./routes/chanel/post/uploads/uploadChanelImages.js";
import multer from "multer";
import path from "path";
import { cloudinary } from "./utils/Cloudinary/Cloudinary.js";

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;

dotenv.config();
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

// app.use(
//   bodyParser.json({
//     limit: "50mb",
//   })
// );

// app.use(
//   bodyParser.urlencoded({
//     // limit: "50mb",
//     // parameterLimit: 100000,
//     extended: true,
//   })
// );

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", `*`);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS,  PUT,PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type, scrolling, a_custom_header"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
const Multer = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".mp4" &&
      ext !== ".mkv" &&
      ext !== ".jpeg" &&
      ext !== ".jpg" &&
      ext !== ".png"
    ) {
      a++;
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
    console.log(a);
  },
});
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");
const uploadVideo = (req, res) => {
  console.log(a);
  console.log(req.file.path);
  cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: "video",
      folder: "video",
    },

    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log(result);
      }
    }
  );
};
app.post("/api/video/uploadfiles", (req, res) => {
  console.log(req.body);
  console.log(req.files);
  console.log(req.file);
  console.log(req.body.file);

  const haha = upload(req, res, (err) => {
    if (err) {
      return { success: false, err };
    }
    return {
      data: req.file,
    };
  });
  console.log(haha);
});

app.get("/api", AuthToken, (req, res) => {
  res.json("non");
});
app.use("/", Routes);

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
