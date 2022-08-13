import mongoose from "mongoose";

const ChanelSchema = mongoose.Schema(
  {
    creator: { type: String, required: true },
    followers: [
      {
        email: String,
        id: String,
      },
    ],
    uploads: [
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
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      website: {
        type: String,
      },
      profileImg: {
        url: String,
        id: String,
        asset_id: String,
      },
      coverImg: {
        url: String,
        id: String,
        asset_id: String,
      },
    },

    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const ChanelModal = mongoose.model("chanels", ChanelSchema);
export default ChanelModal;
