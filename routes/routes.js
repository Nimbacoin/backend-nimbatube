import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChanel from "./chanel/chanel.js";

const allRoutes = [{ name: routesAuth, auth: false }, { name: routesChanel }];

allRoutes.map(({ name, auth }) => {
  Routes.use("/api", name);
});

export default Routes;
