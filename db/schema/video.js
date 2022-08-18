import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
  {
    creatore: String,
    channelId: String,

    filename: String,
    fileId: String,

    title: {
      type: String,
    },
    descreption: {
      type: String,
    },
    thumbnail: String,
    likes: [{ id: String }],
    disLikes: [{ id: String }],
    comments: [{ id: String }],
    views: [{ id: String }],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const videoModal = mongoose.model("video", videoSchema);
export default videoModal;
