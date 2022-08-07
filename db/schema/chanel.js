import mongoose from "mongoose";

const ChanelSchema = mongoose.Schema(
  {
    followers: [
      {
        email: String,
        id: String,
      },
    ],
    videos: [
      {
        title: String,
        id: String,
      },
    ],
    tags: [
      {
        name: String,
        id: String,
      },
    ],
    comments: [
      {
        id: String,
      },
    ],
    chanelData: {
      email: {
        type: String,
      },

      title: {
        type: String,
      },
      website: {
        type: String,
      },
      chanelImg: {
        type: String,
      },
      coverImg: {
        type: String,
      },
    },

    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Chanel = mongoose.model("chanel", ChanelSchema);
export default Chanel;
