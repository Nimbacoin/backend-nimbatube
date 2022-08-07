import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChanel from "./chanel/chanel.js";

const allRoutes = [{ name: routesAuth }, { name: routesChanel }];

allRoutes.map(({ name }) => {
  Routes.use("/api", name);
});

export default Routes;
