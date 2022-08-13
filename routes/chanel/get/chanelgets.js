import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import allChanels from "./allChanels.js";
import chanelPage from "./chanelPage.js";
const routesChanelGet = express.Router();

const allRoutes = [
  {
    name: allChanels,
    auth: true,
    rout: "/all-chanels",
  },
  {
    name: chanelPage,
    auth: false,
    rout: "",
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChanelGet.use(`/get/chanel${rout}:token`, AuthToken, name);
  } else {
    if (rout !== "") {
      routesChanelGet.use(`/get/chanel${rout}`, name);
    } else {
      routesChanelGet.use(`/`, name);
    }
  }
});

export default routesChanelGet;
