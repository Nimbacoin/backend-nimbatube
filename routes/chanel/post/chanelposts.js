import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createNewChanelGeneral from "./create-new-chanel/createNewChanelGeneral.js";
import routerCreateNewChanelOther from "./create-new-chanel/createNewChanelOther.js";
const routesChanelPosts = express.Router();

const allRoutes = [
  {
    name: createNewChanelGeneral,
    auth: true,
    rout: "/create-new-chanel/general",
  },
  {
    name: routerCreateNewChanelOther,
    auth: true,
    rout: "/create-new-chanel/other",
  },
];

// routesChanelPosts.use(
//   `/post/chanel/create-new-chanel/general:token`,
//   AuthToken,
//   createNewChanelGeneral
// );

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChanelPosts.use(`/post/chanel${rout}:token`, AuthToken, name);
  } else {
    console.log("here 222344333333333");
    routesChanelPosts.use(`/post/chanel${rout}:token`, name);
  }
});

// routesChanelPosts.use(
//   `/post/chanel/create-new-chanel/general:token`,
//   AuthToken,
//   createNewChanelGeneral
// );

export default routesChanelPosts;
