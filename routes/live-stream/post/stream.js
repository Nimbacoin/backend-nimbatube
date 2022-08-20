import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createLiveStream from "./createLiveStream.js";
import joinStream from "./joinStream.js";
const stream = express.Router();

const allStreams = [];
stream.post(
  "/post/stream/create-live-stream/:token",
  AuthToken,
  async (req, res) => {
    await createLiveStream(req, res, allStreams);
  }
);

stream.post("/post/stream/join-stream", async (req, res) => {
  await joinStream(req, res, allStreams);
});

export default stream;
