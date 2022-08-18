import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createNewThumbnail from "./createNewThumbnail.js";
import createNewVideo from "./createNewVideo.js";
import submiteVideo from "./submiteVideo.js";
const videoRoutesPosts = express.Router();

const allRoutes = [
  {
    name: createNewVideo,
    auth: true,
  },
  {
    name: createNewThumbnail,
    auth: true,
  },
  {
    name: submiteVideo,
    auth: true,
    rout: "/submite-video/",
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      videoRoutesPosts.use(`/post/video${rout}:token`, AuthToken, name);
    } else {
      videoRoutesPosts.use(`/`, name);
    }
  } else {
    videoRoutesPosts.use(`/post/chanel${rout}:token`, name);
  }
});

export default videoRoutesPosts;
