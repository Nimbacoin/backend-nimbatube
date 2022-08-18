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
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
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
