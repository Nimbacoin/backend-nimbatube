import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createNewChannel from "./createNewChannel.js";
import followChannel from "./followChannel.js";
import testChannel from "./testChannel.js";
import initChannel from "./initChannel.js";
import coverIamgeChannel from "./uploads/coverIamgeChannel.js";
import uploadChannelCoverImages from "./uploads/uploadChannelCoverImages.js";
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
  {
    name: testChannel,
    auth: true,
    rout: "/delete-channel/",
  },
  {
    name: initChannel,
    auth: true,
    rout: "/init-channel/",
  },

  // {
  //   name: uploadChannelCoverImages,
  //   auth: true,
  //   rout: "/init-channel/",
  // },
  {
    name: coverIamgeChannel,
    auth: true,
  },

  //
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      routesChannelPosts.use(`/post/channel${rout}:token`, AuthToken, name);
    } else {
      routesChannelPosts.use(`/`, AuthToken, name);
    }
  } else {
    routesChannelPosts.use(`/post/channel${rout}:token`, name);
  }
});

export default routesChannelPosts;
