import express from "express";
import User from "../../../db/schema/user.js";
// const renderVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import videoModal from "../../../db/schema/video.js";
import s3UploadVideo from "../post/upload/aws3.js";
import timeHandelr from "../post/timeHandelr.js";

const mongoURL = process.env.MONGOCONNECTURL;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "video",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("video");
});

const renderVideo = async (req, res) => {
  videoModal
    .find({ "uploaded.uplaoded": true, "uploaded.finished": false })
    .then((files) => {
      if (files.length >= 1) {
        console.log(files, files.length, "all-files");
        files.map((videoFile) => {
          var objectId = mongoose.Types.ObjectId(videoFile.uploaded.id);
          const channelId = videoFile.channelId;
          console.log(videoFile.location);
          gfs.files.findOne({ _id: objectId }, (err, file) => {
            // console.log(file);
            var bufferArray = [];
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.on("data", async (chunk) => {
              // console.log(chunk);
              bufferArray.push(chunk);
            });
            readStream.on("end", async () => {
              var buffer = Buffer.concat(bufferArray);
              const reslt = await s3UploadVideo(
                buffer,
                file.filename,
                "videos",
                process.env.AWS_BUCKET_NAME
              );
              console.log("reslt", reslt);
              if (reslt) {
                try {
                  const filter = {
                    _id: videoFile._id,
                  };

                  videoFile.location = reslt.Location;
                  videoFile.uploaded.finished = true;
                  // await timeHandelr(newFile._id, File.path);
                  await videoModal.updateOne(filter, videoFile);
                } catch (error) {}
              }

              console.log(buffer, "finish");
            });
          });
        });
      } else {
        console.log("no videos to update");
      }
    });
};

export default renderVideo;
