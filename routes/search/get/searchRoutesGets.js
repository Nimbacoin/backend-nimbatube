import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";

const videoRoutesPosts = express.Router();

const allRoutes = [];

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
