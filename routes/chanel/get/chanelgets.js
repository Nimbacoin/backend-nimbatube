import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import AllChanels from "./AllChanels.js";
const routesChanelGet = express.Router();

const allRoutes = [
  {
    name: AllChanels,
    auth: true,
    rout: "/all-chanels",
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChanelGet.use(`/get/chanel${rout}:token`, AuthToken, name);
  } else {
    routesChanelGet.use(`/get/chanel${rout}:token`, name);
  }
});

export default routesChanelGet;
