import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createNewChanelGeneral from "./create-new-chanel/createNewChanelGeneral.js";
import uploadChanelImages from "./uploads/uploadChanelImages.js";
const routesChanelPosts = express.Router();

const allRoutes = [
  {
    name: createNewChanelGeneral,
    auth: true,
    rout: "/create-new-chanel",
  },
  {
    name: uploadChanelImages,
    auth: true,
    rout: "/upload-profile",
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChanelPosts.use(`/post/chanel${rout}:token`, AuthToken, name);
  } else {
    routesChanelPosts.use(`/post/chanel${rout}:token`, name);
  }
});

export default routesChanelPosts;
