import express from "express";
import User from "../../../db/schema/user.js";
const renderImages = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";

const mongoURL = process.env.MONGOCONNECT;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  console.log("db is connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

renderImages.get("/get/read/images/:filename", async (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    console.log(req.params.filename);
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

export default renderImages;