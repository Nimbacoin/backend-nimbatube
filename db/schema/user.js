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
    senders: { type: [] },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserScheme);
export default User;
