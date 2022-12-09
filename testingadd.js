import channelModal from "./db/schema/channel.js";
import fs from "fs";
import path from "path";
import request from "request";
import s3UploadVideo from "./routes/video/post/upload/aws3.js";

const applod = async () => {
  await channelModal.find({}).then((channels) => {
    const Request = request.defaults({ encoding: null });
    channels.map(async (channel, index) => {
      if (index <= 1 && channel?.channelData?.coverImg?.url?.length) {
        //   await channelModal
        //     .findOne({ _id: channel._id })
        //     .then(async (channelId) => {
        //       if (!channelId?.channelData?.coverImg?.url.includes("http")) {
        //         Request.get(
        //           "https://be.nimbatube.com" +
        //             "/get/read/images/" +
        //             channel.channelData.coverImg.url
        //           // async (err, res, body) => {
        //           //   //process exif here
        //           //   if (body) {
        //           //     const reslt = await s3UploadVideo(
        //           //       body,
        //           //       channelId._id,
        //           //       "images",
        //           //       "images"
        //           //     );
        //           //   }
        //           // }
        //         );
        //       } else {
        //       }
        //     });
      }
    });
  });
};

export default applod;
