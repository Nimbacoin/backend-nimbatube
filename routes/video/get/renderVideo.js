import express from "express";
import User from "../../../db/schema/user.js";
const renderVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import videoModal from "../../../db/schema/video.js";

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

renderVideo.get("/get/read/video/:filename", async (req, res) => {
  const id = req.params.filename;
  if (mongoose.Types.ObjectId.isValid(id)) {
    videoModal.findById({ _id: id }).then((newFile) => {
      if (newFile) {
        var fileId = mongoose.Types.ObjectId(newFile.fileId);
        gfs.files.findOne({ _id: fileId }, (err, file) => {
          if (file) {
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);
          } else {
            res.status(404).json({
              err: "Not an video",
            });
          }
        });
      }
    });
  }
});

export default renderVideo;
