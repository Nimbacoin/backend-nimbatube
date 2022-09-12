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
  if (typeof id !== "undefined" && id?.length > 10) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      videoModal.findById({ _id: id }).then((newFile) => {
        if (newFile) {
          var fileId = mongoose.Types.ObjectId(newFile.fileId);
          gfs.files.findOne({ _id: fileId }, (err, file) => {
            if (file) {
              const range = req.headers.range;
              if (!range) {
                res.status(400).send("Requires Range header");
              }
              const videoSize = file.length;
              const start = 0;
              const end = videoSize - 1;
              // console.log(start);
              // console.log(end);
              const contentLength = end - start + 1;
              const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
              };

              // HTTP Status 206 for Partial Content
              res.writeHead(206, headers);
              const readStream = gridfsBucket.openDownloadStream(file._id, {
                start,
              });
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
  }
});

export default renderVideo;
