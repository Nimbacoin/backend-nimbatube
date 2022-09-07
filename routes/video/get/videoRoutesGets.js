import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import allVideos from "./allVideos.js";
import renderVideo from "./renderVideo.js";
import videoData from "./videoData.js";
const videoRoutesGets = express.Router();

const allRoutes = [
  {
    name: renderVideo,
    auth: false,
  },
  {
    name: allVideos,
    auth: false,
    rout: "/display",
  },
  {
    name: videoData,
    auth: false,
    rout: "",
  },
  
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      videoRoutesGets.use(`/get/chanel${rout}:token`, AuthToken, name);
    } else {
      videoRoutesGets.use(`/`, name);
    }
  } else {
    if (rout) {
      videoRoutesGets.use(`/get/video${rout}`, name);
    } else {
      videoRoutesGets.use(`/`, name);
    }
  }
});

export default videoRoutesGets;
