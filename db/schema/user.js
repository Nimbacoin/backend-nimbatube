import mongoose from "mongoose";

const UserScheme = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    chenels: [{ id: String }],
    notification: [
      {
        id: String,
        seen: { type: Boolean, default: false },
        from: {
          channel: String,
          user: String,
          videoId: String,
          createAt: String,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now(),
    },
    videoHistory: [{ id: String, watcheddAt: String }],
    // followingChannels: [{ id: String, followedAt: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserScheme);
export default User;
