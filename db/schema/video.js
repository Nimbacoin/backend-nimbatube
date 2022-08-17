import mongoose from "mongoose";

const ChanelSchema = mongoose.Schema(
  {
    path: {
      type: String,
    },
    tilte: {
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
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Chanel = mongoose.model("chanel", ChanelSchema);
export default Chanel;
