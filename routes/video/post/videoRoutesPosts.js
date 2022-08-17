import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createNewThumbnail from "./createNewThumbnail.js";
import createNewVideo from "./createNewVideo.js";
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
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      videoRoutesPosts.use(`/post/chanel${rout}:token`, AuthToken, name);
    } else {
      videoRoutesPosts.use(`/`, name);
    }
  } else {
    videoRoutesPosts.use(`/post/chanel${rout}:token`, name);
  }
});

export default videoRoutesPosts;
