import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import renderVideo from "./renderVideo.js";
const videoRoutesGets = express.Router();

const allRoutes = [
  {
    name: renderVideo,
    false: false,
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      videoRoutesGets.use(`/post/chanel${rout}:token`, AuthToken, name);
    } else {
      videoRoutesGets.use(`/`, name);
    }
  } else {
    videoRoutesGets.use(`/`, name);
  }
});

export default videoRoutesGets;
