import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChanel from "./chanel/chanel.js";

const allRoutes = [{ name: routesAuth, auth: false }, { name: routesChanel }];

Routes.use("/api", routesAuth);
Routes.use("/api", routesChanel);

export default Routes;
