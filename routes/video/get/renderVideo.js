// import the packages
import mongoose from "mongoose";
import express from "express";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import dbConnect from "../../../db/dbConnect.js";
const renderVideo = express.Router();

renderVideo.get("/:filename", async (req, res) => {
  console.log("sdkskdldskd");
  await dbConnect();
  const conn = mongoose.connection;
  const gfs = await Grid(conn.db, mongoose.mongo);
  gfs.collection("video");
  const { filename } = req.params;
  try {
    const readstream = await gfs.createReadStream({ filename });

    readstream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

export default renderVideo;
