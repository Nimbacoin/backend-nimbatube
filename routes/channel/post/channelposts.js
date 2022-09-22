import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createNewChannel from "./createNewChannel.js";
import followChannel from "./followChannel.js";
const routesChannelPosts = express.Router();

const allRoutes = [
  {
    name: createNewChannel,
    auth: true,
    rout: "/create-new-channel",
  },
  {
    name: followChannel,
    auth: true,
    rout: "/follow-channel",
  },
  //
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChannelPosts.use(`/post/channel${rout}:token`, AuthToken, name);
  } else {
    routesChannelPosts.use(`/post/channel${rout}:token`, name);
  }
});

export default routesChannelPosts;
