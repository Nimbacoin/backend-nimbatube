import express from "express";
import routesChanelDeletes from "./delete/chanelDeletes.js";
import routesChanelGet from "./get/chanelgets.js";
import routesChanelPosts from "./post/chanelposts.js";

const routesChanel = express.Router();
routesChanel.use("/", routesChanelGet);
routesChanel.use("/", routesChanelPosts);
routesChanel.use("/", routesChanelDeletes);

export default routesChanel;
