import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const searching = express.Router();

searching.post("/", async (req, res) => {
  const searchData = req.body.searchData;
  const channels = await channelModal.find({});

  if (channels?.length >= 1 && searchData?.length >= 1) {
    const filtered = channels.filter(({ channelData }) => {
      console.log(channelData);
      return (
        channelData?.name?.includes(searchData) ||
        channelData?.title?.includes(searchData) ||
        channelData?.title?.includes(searchData)
      );
    });
    console.log("filtered", filtered.length);
  }
});

export default searching;
