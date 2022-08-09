import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import deleteChanel from "./deleteChanel.js";
const routesChanelDeletes = express.Router();

const allRoutes = [
  {
    name: deleteChanel,
    auth: true,
    rout: "/delete-chanel",
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChanelDeletes.use(`/delete/chanel${rout}:token`, AuthToken, name);
  } else {
    routesChanelDeletes.use(`/delete/chanel${rout}:token`, name);
  }
});

export default routesChanelDeletes;
