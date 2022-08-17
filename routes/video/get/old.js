import express from "express";
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
const renderVideo = express.Router();

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

renderVideo.get("/get/videos/:filename", async (req, res) => {
  console.log(req.params.filename);
  gfs.files.findOne({ filename: req.params.filename }, async (err, file) => {
    try {
      const filefilename = file.filename;
      const readstream = await gridfsBucket.createReadStream(filefilename);
      readstream.pipe(res);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
    // const readStream = gridfsBucket.openDownloadStream(file._id);
    // readStream.pipe(res);
  });
});

export default renderVideo;
