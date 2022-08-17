import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChannel from "./channel/channel.js";
import videoRoutes from "./video/videoRoutes.js";

// const allRoutes = [{ name: routesAuth, auth: false }, { name: routesChanel }];

Routes.use("/api", routesAuth);
Routes.use("/api", routesChannel);
Routes.use("/api", videoRoutes);

export default Routes;
