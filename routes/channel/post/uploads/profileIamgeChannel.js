import express from "express";

const profileIamgeChannel = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import AuthToken from "../../../../utils/verify-user/VerifyUser.js";
import channelModal from "../../../../db/schema/channel.js";

const mongoURL = process.env.MONGOCONNECT;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket, gridfsBucketThumbnail;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    const channelId = req.body.channelId;
    console.log("channelId", req.body.channelId);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        } else {
          const filename =
            channelId + buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "images",
          };
          resolve(fileInfo);
        }
      });
    });
  },
});

const upload = multer({ storage });
profileIamgeChannel.post(
  "/post/channel/channel-profile-image/:token",
  AuthToken,
  upload.single("thumbnail"),
  async (req, res) => {
    const File = req.file;
    const contentType = File.contentType;
    if (
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpg" ||
      contentType === "image/jpeg" ||
      contentType === "image/jfif" ||
      contentType === "image/svg"
    ) {
      const channelId = req.body.channelId;
      // console.log(File);
      if (channelId) {
        const filter = { _id: channelId };

        try {
          await channelModal.findOne(filter).then(async (doc) => {
            var update = doc;
            const channelData = doc.channelData;
            update.channelData.profileImg.url = File.filename;
            if (doc) {
              // update = { coverImg: { url: File.filename, id: File.id } };
              console.log(update);
              await channelModal.updateOne(filter, update);
              await channelModal.findOne(filter).then(async (fd) => {
                console.log("changed", fd.channelData.coverImg);
              });
              res.json({ file: File, uploaded: true });
            }
          });
        } catch (error) {}
      }
    } else {
      // gfs.files.deleteOne(
      //   { filename: File.filename, root: "images" },
      //   (err, gridStore) => {
      //     if (err) {
      //       console.log("i dont want to delete the file ok");
      //       return res.status(404).json({ err: err });
      //     } else {
      //       res.json({ file: "ONLYIMAGEALLOWED" });
      //     }
      //   }
      // );
    }
    req.file = null;
  }
);

export default profileIamgeChannel;
